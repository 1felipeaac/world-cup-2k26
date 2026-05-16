import { db } from "../db/database";
import { MatchResult, type Stats, type Team } from "../types/tournament";
import { MatchRepository } from "../repositories/match-repository";
import { SweepstakesService } from "./sweepstakes-service";

export const SimulatorService = {
  /**
   * Atualiza o placar de uma partida e engatilha o recálculo dos times
   */
  updateMatchScore: async (
    matchId: number,
    homeGoals: number,
    awayGoals: number,
  ) => {
    if (homeGoals < 0 || awayGoals < 0) return;

    // 2. ATENÇÃO: Tem que adicionar a tabela db.sweepstakesUsers e db.sweepstakesBets no array da transação!
    await db.transaction(
      "rw",
      [db.matches, db.teams, db.sweepstakesUsers, db.sweepstakesBets],
      async () => {
        const match = await db.matches.get(matchId);
        if (!match) throw new Error("Partida não encontrada");

        // Atualiza o jogo
        await db.matches.update(matchId, {
          homeTeamGoals: homeGoals,
          awayTeamGoals: awayGoals,
        });

        // Recalcula os times oficiais
        await SimulatorService.recalculateTeamStats(match.homeTeamId);
        await SimulatorService.recalculateTeamStats(match.awayTeamId);

        // 3. A MAGIA ACONTECE AQUI: Recalcula o Bolão imediatamente!
        await SweepstakesService.recalculateAllBolaoScores();
      },
    );
  },

  recalculateTeamStats: async (teamId: number) => {
    const matches = await MatchRepository.getByTeam(teamId);

    const newStats: Stats = {
      wins: 0,
      losses: 0,
      draws: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
      recentForm: [],
    };

    const sortedMatches = matches.sort((a, b) => a.id - b.id);

    sortedMatches.forEach((m) => {
      if (m.homeTeamGoals !== null && m.awayTeamGoals !== null) {
        const isHome = m.homeTeamId === teamId;
        const gf = isHome ? m.homeTeamGoals : m.awayTeamGoals;
        const ga = isHome ? m.awayTeamGoals : m.homeTeamGoals;

        newStats.goalsFor += gf;
        newStats.goalsAgainst += ga;

        if (gf > ga) {
          newStats.wins++;
          newStats.points += 3;
          newStats.recentForm?.push(MatchResult.WIN);
        } else if (gf < ga) {
          newStats.losses++;
          newStats.recentForm?.push(MatchResult.LOSS);
        } else {
          newStats.draws++;
          newStats.points += 1;
          newStats.recentForm?.push(MatchResult.DRAW);
        }
      }
    });

    newStats.goalDifference = newStats.goalsFor - newStats.goalsAgainst;

    await db.teams.update(teamId, { stats: newStats });
  },

  resetTournament: async () => {
    await db.transaction("rw", [db.matches, db.teams], async () => {
      await db.matches.toCollection().modify({
        homeTeamGoals: null,
        awayTeamGoals: null,
      });

      const initialStats = {
        wins: 0,
        losses: 0,
        draws: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0,
        recentForm: [],
      };

      await db.teams.toCollection().modify((team) => {
        team.stats = { ...initialStats };
      });
    });

    console.log("Torneio resetado com sucesso!");
  },

  resetGroup: async (groupId: number) => {
    // Transação envolvendo grupos, partidas e times
    await db.transaction("rw", [db.groups, db.matches, db.teams], async () => {
      // 1. Zera apenas as partidas que pertencem a este grupo
      await db.matches.where("groupId").equals(groupId).modify({
        homeTeamGoals: null,
        awayTeamGoals: null,
      });

      // 2. Busca o grupo para saber quais times estão nele
      const group = await db.groups.get(groupId);
      if (!group) throw new Error("Grupo não encontrado");

      // Extrai apenas os IDs dos 4 times deste grupo
      const teamIds = group.teams.map((t) => t.id);

      const initialStats = {
        wins: 0,
        losses: 0,
        draws: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0,
        recentForm: [],
      };

      // 3. Reseta os status APENAS dos times filtrados (anyOf atua como um WHERE IN)
      await db.teams
        .where("id")
        .anyOf(teamIds)
        .modify((team) => {
          team.stats = { ...initialStats };
        });
    });
  },

  getClassifiedTeams: async () => {
    // 1. Trazemos os grupos e as equipas para a memória
    const groups = await db.groups.toArray();
    const teams = await db.teams.toArray();

    // Dicionário para acesso ultra-rápido às equipas: O(1)
    const teamsMap = new Map(teams.map((t) => [t.id, t]));

    const directlyClassified: Team[] = [];
    const thirdPlacedPool: Team[] = [];

    // 2. Critérios de Desempate (Regra base da FIFA)
    // Ordem: Pontos > Saldo de Golos > Golos Marcados
    const sortTeams = (a: Team, b: Team) => {
      if (b.stats.points !== a.stats.points)
        return b.stats.points - a.stats.points;
      if (b.stats.goalDifference !== a.stats.goalDifference)
        return b.stats.goalDifference - a.stats.goalDifference;
      if (b.stats.goalsFor !== a.stats.goalsFor)
        return b.stats.goalsFor - a.stats.goalsFor;

      // Empate total: Na vida real haveria cartões amarelos (Fair Play) ou sorteio.
      // Para o simulador, podemos usar o ID como critério de desempate "aleatório" determinístico.
      return a.id - b.id;
    };

    // 3. Varrer cada um dos 12 grupos
    for (const group of groups) {
      // Reconstrói a lista de equipas do grupo com os dados atualizados
      const groupTeams = group.teams
        .map((gt) => teamsMap.get(gt.id))
        .filter((t): t is Team => t !== undefined);

      // Ordena o grupo do 1º ao 4º lugar
      groupTeams.sort(sortTeams);

      // Salva os que passam direto (1º e 2º lugares)
      if (groupTeams[0]) directlyClassified.push(groupTeams[0]);
      if (groupTeams[1]) directlyClassified.push(groupTeams[1]);

      // Salva o 3º lugar na "piscina" de repescagem
      if (groupTeams[2]) thirdPlacedPool.push(groupTeams[2]);
    }

    // 4. Ordenar a "piscina" dos terceiros classificados usando as mesmas regras
    thirdPlacedPool.sort(sortTeams);

    // 5. Extrair apenas os 8 melhores terceiros
    const bestThirds = thirdPlacedPool.slice(0, 8);

    // Retornamos tudo separadinho caso a UI queira mostrar "Quem passou em 3º?" com uma cor diferente
    return {
      directlyClassified, // 24 equipas
      bestThirds, // 8 equipas
      allClassified: [...directlyClassified, ...bestThirds], // As 32 equipas finais!
    };
  },
};

import { db } from "../db/database";
import {
  MatchResult,
  TournamentStage,
  type Match,
  type Stats,
  type Team,
} from "../types/tournament";
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
        await SweepstakesService.recalculateAllSweeptakesScores();
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
      // 1. Zera os golos APENAS dos jogos da Fase de Grupos
      await db.matches
        .where("stage")
        .equals(TournamentStage.GROUP_STAGE)
        .modify({
          homeTeamGoals: null,
          awayTeamGoals: null,
        });

      // 2. EXTERMINA todos os jogos de Mata-mata (do 16-avos à Final)
      // Eles serão recriados do zero quando o utilizador clicar em "Gerar Chaveamento" novamente
      await db.matches
        .where("stage")
        .notEqual(TournamentStage.GROUP_STAGE)
        .delete();

      // 3. Zera as estatísticas de todas as seleções
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

    console.log(
      "🔄 Torneio completamente resetado (Grupos zerados e Mata-mata apagado)!",
    );
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

  generateKnockoutMatches: async () => {
    
    const { directlyClassified, bestThirds } =
      await SimulatorService.getClassifiedTeams();

    
    const firstPlaces = directlyClassified.filter(
      (_, index) => index % 2 === 0,
    );
    const secondPlaces = directlyClassified.filter(
      (_, index) => index % 2 !== 0,
    );

    
    secondPlaces.sort(
      (a, b) =>
        b.stats.points - a.stats.points ||
        b.stats.goalDifference - a.stats.goalDifference,
    );

    // Pote 1: 12 Primeiros + 4 Melhores Segundos = 16 Equipas Fortes
    const pot1 = [...firstPlaces, ...secondPlaces.slice(0, 4)];

    // Pote 2: 8 Piores Segundos + 8 Melhores Terceiros = 16 Equipas Desafiantes
    const pot2 = [...secondPlaces.slice(4, 12), ...bestThirds];

    // Invertemos o Pote 2 para que o 1º Colocado Geral (pot1[0]) enfrente o "Pior" Terceiro (pot2[15])
    pot2.reverse();

    const newMatches: Match[] = [];

    let matchIdCounter = 73;

    // 3. Monta os 16 jogos
    for (let i = 0; i < 16; i++) {
      newMatches.push({
        id: matchIdCounter++,
        stage: TournamentStage.ROUND_OF_32, // Marcador crucial para sabermos que é mata-mata
        homeTeamId: pot1[i].id,
        awayTeamId: pot2[i].id,
        homeTeamGoals: null,
        awayTeamGoals: null,
        date: null,
        // (Opcional) Poderia adicionar uma data fictícia aqui
      });
    }

    // 4. Salva no banco de dados de forma segura
    await db.transaction("rw", db.matches, async () => {
      // Limpa qualquer chaveamento de mata-mata anterior (útil se o utilizador quiser recalcular)
      await db.matches
        .where("stage")
        .notEqual(TournamentStage.GROUP_STAGE)
        .delete();

      // Insere os 16 novos confrontos de uma vez
      await db.matches.bulkAdd(newMatches);
    });

    console.log("🔥 Confrontos dos 16-avos gerados com sucesso!");
  },

  updateKnockoutMatchScore: async (
    matchId: number,
    homeGoals: number,
    awayGoals: number,
    homePenalties: number | null,
    awayPenalties: number | null,
  ) => {
    await db.transaction("rw", db.matches, async () => {
      // 1. Grava o resultado do jogo atual
      await db.matches.update(matchId, {
        homeTeamGoals: homeGoals,
        awayTeamGoals: awayGoals,
        homeTeamPenalties: homePenalties,
        awayTeamPenalties: awayPenalties,
      });

      const currentMatch = await db.matches.get(matchId);
      if (!currentMatch) return;

      // 2. Descobre quem ganhou E quem perdeu
      let winnerId: number;
      let loserId: number; 

      if (homeGoals > awayGoals) {
        winnerId = currentMatch.homeTeamId;
        loserId = currentMatch.awayTeamId;
      } else if (awayGoals > homeGoals) {
        winnerId = currentMatch.awayTeamId;
        loserId = currentMatch.homeTeamId;
      } else {
        // Empate decidido nos penáltis
        if (
          homePenalties !== null &&
          awayPenalties !== null &&
          homePenalties > awayPenalties
        ) {
          winnerId = currentMatch.homeTeamId;
          loserId = currentMatch.awayTeamId;
        } else {
          winnerId = currentMatch.awayTeamId;
          loserId = currentMatch.homeTeamId;
        }
      }

      // 3. Algoritmo de Avanço na Árvore
      let nextMatchId = null;
      let nextStage = null;
      let isHomeInNextMatch = true;

      if (matchId >= 73 && matchId <= 88) {
        const index = matchId - 73;
        nextMatchId = 89 + Math.floor(index / 2);
        nextStage = TournamentStage.ROUND_OF_16;
        isHomeInNextMatch = index % 2 === 0;
      } else if (matchId >= 89 && matchId <= 96) {
        const index = matchId - 89;
        nextMatchId = 97 + Math.floor(index / 2);
        nextStage = TournamentStage.QUARTER_FINALS;
        isHomeInNextMatch = index % 2 === 0;
      } else if (matchId >= 97 && matchId <= 100) {
        const index = matchId - 97;
        nextMatchId = 101 + Math.floor(index / 2);
        nextStage = TournamentStage.SEMI_FINALS;
        isHomeInNextMatch = index % 2 === 0;
      } else if (matchId >= 101 && matchId <= 102) {
        const index = matchId - 101;
        nextMatchId = 103; // 103 é a Final
        nextStage = TournamentStage.FINAL;
        isHomeInNextMatch = index % 2 === 0;
      }

      if (!nextMatchId || !nextStage) return;

      // 4. Injeta o VENCEDOR no próximo jogo (Lógica Original Mantida)
      const nextMatch = await db.matches.get(nextMatchId);

      const updateWinnerData: Partial<Match> = {
        homeTeamGoals: null,
        awayTeamGoals: null,
        homeTeamPenalties: null,
        awayTeamPenalties: null,
      };

      if (isHomeInNextMatch) {
        updateWinnerData.homeTeamId = winnerId;
      } else {
        updateWinnerData.awayTeamId = winnerId;
      }

      if (nextMatch) {
        await db.matches.update(nextMatchId, updateWinnerData);
      } else {
        await db.matches.put({
          id: nextMatchId,
          stage: nextStage,
          homeTeamId: isHomeInNextMatch ? winnerId : 0,
          awayTeamId: !isHomeInNextMatch ? winnerId : 0,
          homeTeamGoals: null,
          awayTeamGoals: null,
          homeTeamPenalties: null,
          awayTeamPenalties: null,
          date: null,
        });
      }

      // 5. 🚀 NOVA LÓGICA: Injeta o PERDEDOR na Disputa de 3º Lugar (Se a próxima fase for a Final)
      if (nextStage === TournamentStage.FINAL) {
        const thirdPlaceMatchId = 104; // Definimos o 104 para o jogo de 3º lugar
        const thirdPlaceMatch = await db.matches.get(thirdPlaceMatchId);

        const updateLoserData: Partial<Match> = {
          homeTeamGoals: null,
          awayTeamGoals: null,
          homeTeamPenalties: null,
          awayTeamPenalties: null,
        };

        // Aproveitamos a mesma matemática: O perdedor da Semi 1 fica em Casa, o da Semi 2 fica Fora
        if (isHomeInNextMatch) {
          updateLoserData.homeTeamId = loserId;
        } else {
          updateLoserData.awayTeamId = loserId;
        }

        if (thirdPlaceMatch) {
          await db.matches.update(thirdPlaceMatchId, updateLoserData);
        } else {
          // Cria o jogo de 3º lugar se ele ainda não existir!
          await db.matches.put({
            id: thirdPlaceMatchId,
            stage: TournamentStage.THIRD_PLACE, 
            homeTeamId: isHomeInNextMatch ? loserId : 0,
            awayTeamId: !isHomeInNextMatch ? loserId : 0,
            homeTeamGoals: null,
            awayTeamGoals: null,
            homeTeamPenalties: null,
            awayTeamPenalties: null,
            date: null,
          });
        }
        console.log(`🥉 Perdedor enviado para a disputa de 3º Lugar (Jogo ${thirdPlaceMatchId})!`);
      }

    });

    console.log(`🚀 Vencedor avançado para o jogo ${matchId}!`);
  },
};

import { db } from '../db/database';
import { MatchResult, type Stats } from '../model/tournament';
import { MatchRepository } from '../repositories/match-repository';


export const SimulatorService = {
  
  /**
   * Atualiza o placar de uma partida e engatilha o recálculo dos times
   */
  updateMatchScore: async (matchId: number, homeGoals: number, awayGoals: number) => {
    // Abre uma transação de Leitura/Escrita (rw) nas tabelas matches e teams
    await db.transaction('rw', [db.matches, db.teams], async () => {
      
      // 1. Atualiza o jogo
      const match = await db.matches.get(matchId);
      if (!match) throw new Error("Partida não encontrada");

      await db.matches.update(matchId, { homeTeamGoals: homeGoals, awayTeamGoals: awayGoals });

      // 2. Recalcula as estatísticas dos dois times envolvidos do zero
      await SimulatorService.recalculateTeamStats(match.homeTeamId);
      await SimulatorService.recalculateTeamStats(match.awayTeamId);
    });
  },

  /**
   * Regra de negócio isolada para recalcular um time
   */
  recalculateTeamStats: async (teamId: number) => {
    const matches = await MatchRepository.getByTeam(teamId);
    
    // Status zerado para recalcular
    const newStats: Stats = { 
        wins: 0, losses: 0, draws: 0, 
        goalsFor: 0, goalsAgainst: 0, goalDifference: 0, 
        points: 0, recentForm: [] 
    };

    // Ordena por ID ou Data para garantir que o 'recentForm' fique na ordem correta
    const sortedMatches = matches.sort((a, b) => a.id - b.id);

    sortedMatches.forEach(m => {
      // Só processa se o jogo já teve placar inserido (diferente de null/undefined)
      if (m.homeTeamGoals !== undefined && m.awayTeamGoals !== undefined) {
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

    // Salva o time atualizado
    await db.teams.update(teamId, { stats: newStats });
  }
};
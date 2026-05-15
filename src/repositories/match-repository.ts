import { db } from '../db/database';


export const MatchRepository = {
  // Busca todos os jogos de uma rodada específica
  getByRound: async (roundId: number) => {
    return await db.matches.where('roundId').equals(roundId).toArray();
  },

  // Busca todos os jogos de um grupo
  getByGroup: async (groupId: number) => {
    return await db.matches.where('groupId').equals(groupId).toArray();
  },

  // Busca histórico de um time (para calcular os stats)
  getByTeam: async (teamId: number) => {
    return await db.matches
      .where('homeTeamId').equals(teamId)
      .or('awayTeamId').equals(teamId)
      .toArray();
  }
};
import { db } from '../db/database';


export const MatchRepository = {

  getByRound: async (roundId: number) => {
    return await db.matches.where('roundId').equals(roundId).toArray();
  },


  getByGroup: async (groupId: number) => {
    return await db.matches.where('groupId').equals(groupId).toArray();
  },


  getByTeam: async (teamId: number) => {
    return await db.matches
      .where('homeTeamId').equals(teamId)
      .or('awayTeamId').equals(teamId)
      .toArray();
  },

  getByGroupAndRound: async (groupId: number, roundId: number) => {

    if (!groupId || !roundId) return [];

    const matches = await db.matches
      .where('groupId')
      .equals(groupId)
      .toArray();

    return matches.filter(m => m.roundId === roundId);
  }
};
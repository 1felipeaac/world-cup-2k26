import { db } from "../db/database";
import { TournamentStage } from "../types/tournament";


export const SweepstakesService = {
  
  addParticipant: async (name: string) => {
    const cleanName = name.trim();
    if (!cleanName) throw new Error("O nome não pode estar vazio.");

    
    await db.sweepstakesUsers.add({
      name: cleanName,
      totalPoints: 0,
      
    });
  },

  saveBet: async (
    userId: number,
    matchId: number,
    homeGoals: number,
    awayGoals: number,
  ) => {
    if (homeGoals < 0 || awayGoals < 0) return; 

    const officialMatch = await db.matches.get(matchId);
    if (!officialMatch) throw new Error("Partida oficial não encontrada.");

    if (officialMatch.homeTeamGoals !== null && officialMatch.awayTeamGoals !== null) {
      console.warn("Tentativa de alterar um palpite de um jogo já realizado/em andamento.");
      return;
    }

    
    const existingBet = await db.sweepstakesBets
      .where("[userId+matchId]")
      .equals([userId, matchId])
      .first();

    if (existingBet && existingBet.id) {
      
      await db.sweepstakesBets.update(existingBet.id, {
        homeTeamGoals: homeGoals,
        awayTeamGoals: awayGoals,
      });
    } else {
      
      await db.sweepstakesBets.add({
        userId,
        matchId,
        homeTeamGoals: homeGoals,
        awayTeamGoals: awayGoals,
        pointsEarned: 0, 
      });
    }
  },

  
  getUserBets: async (userId: number) => {
    return await db.sweepstakesBets.where("userId").equals(userId).toArray();
  },

  recalculateAllSweeptakesScores: async () => {
    
    await db.transaction('rw', [db.sweepstakesUsers, db.sweepstakesBets, db.matches], async () => {
      const users = await db.sweepstakesUsers.toArray();
      const allBets = await db.sweepstakesBets.toArray();
      const allMatches = await db.matches.toArray();

      
      const matchMap = new Map(allMatches.map(m => [m.id, m]));

      
      const stageWeights = {
        [TournamentStage.GROUP_STAGE]: 1,
        [TournamentStage.ROUND_OF_32]: 2,
        [TournamentStage.ROUND_OF_16]: 3,
        [TournamentStage.QUARTER_FINALS]: 4,
        [TournamentStage.SEMI_FINALS]: 5,
        [TournamentStage.THIRD_PLACE]: 5,
        [TournamentStage.FINAL]: 10,
      };

      
      for (const user of users) {
        let totalPoints = 0;
        
        
        const userBets = allBets.filter(b => b.userId === user.id);

        for (const bet of userBets) {
          const match = matchMap.get(bet.matchId);

          
          if (match && match.homeTeamGoals !== null && match.awayTeamGoals !== null) {
            
            
            const actualHome = match.homeTeamGoals;
            const actualAway = match.awayTeamGoals;
            
            
            const betHome = bet.homeTeamGoals;
            const betAway = bet.awayTeamGoals;

            
            const actualResult = actualHome > actualAway ? 'HOME' : actualHome < actualAway ? 'AWAY' : 'DRAW';

            if(betHome === null || betAway === null) continue;

            const betResult = betHome > betAway ? 'HOME' : betHome < betAway ? 'AWAY' : 'DRAW';

            
            const isExactScore = (actualHome === betHome && actualAway === betAway);
            const isCorrectOutcome = (actualResult === betResult);

            
            const multiplier = stageWeights[match.stage] || 1;

            if (isExactScore) {
              
              totalPoints += (3 * multiplier);
            } else if (isCorrectOutcome) {
              
              totalPoints += (1 * multiplier);
            }
          }
        }

        
        await db.sweepstakesUsers.update(user.id!, { totalPoints });
      }
    });

    console.log("🎯 Ranking do Bolão atualizado com os novos pesos do Mata-mata!");
  },

  removeParticipant: async (userId: number) => {
    
    await db.transaction('rw', [db.sweepstakesUsers, db.sweepstakesBets], async () => {
      
      await db.sweepstakesBets.where('userId').equals(userId).delete();
      
      
      await db.sweepstakesUsers.delete(userId);
    });
  },
};

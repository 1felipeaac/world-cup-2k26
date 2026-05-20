import { db } from "../db/database";
import { TournamentStage } from "../types/tournament";


export const SweepstakesService = {
  /**
   * Adiciona um novo participante ao Bolão com zero pontos iniciais.
   */
  addParticipant: async (name: string) => {
    const cleanName = name.trim();
    if (!cleanName) throw new Error("O nome não pode estar vazio.");

    // O ++id (auto-incremento) do Dexie tratará de gerar o ID
    await db.sweepstakesUsers.add({
      name: cleanName,
      totalPoints: 0,
      // Se quiser, pode adicionar um avatarUrl padrão aqui no futuro
    });
  },

  saveBet: async (
    userId: number,
    matchId: number,
    homeGoals: number,
    awayGoals: number,
  ) => {
    if (homeGoals < 0 || awayGoals < 0) return; // Proteção contra números negativos

    const officialMatch = await db.matches.get(matchId);
    if (!officialMatch) throw new Error("Partida oficial não encontrada.");

    if (officialMatch.homeTeamGoals !== null && officialMatch.awayTeamGoals !== null) {
      console.warn("Tentativa de alterar um palpite de um jogo já realizado/em andamento.");
      return;
    }

    // Verifica de forma ultra-rápida se o utilizador já palpitou neste jogo
    const existingBet = await db.sweepstakesBets
      .where("[userId+matchId]")
      .equals([userId, matchId])
      .first();

    if (existingBet && existingBet.id) {
      // Se já existe, apenas atualizamos os golos
      await db.sweepstakesBets.update(existingBet.id, {
        homeTeamGoals: homeGoals,
        awayTeamGoals: awayGoals,
      });
    } else {
      // Se não existe, criamos um novo palpite
      await db.sweepstakesBets.add({
        userId,
        matchId,
        homeTeamGoals: homeGoals,
        awayTeamGoals: awayGoals,
        pointsEarned: 0, // Começa a 0. Será calculado quando o jogo oficial acabar!
      });
    }
  },

  /**
   * Vai buscar todos os palpites de um utilizador (para preencher os inputs na UI).
   */
  getUserBets: async (userId: number) => {
    return await db.sweepstakesBets.where("userId").equals(userId).toArray();
  },

  recalculateAllSweeptakesScores: async () => {
    // Transação envolvendo utilizadores, palpites e os jogos oficiais
    await db.transaction('rw', [db.sweepstakesUsers, db.sweepstakesBets, db.matches], async () => {
      const users = await db.sweepstakesUsers.toArray();
      const allBets = await db.sweepstakesBets.toArray();
      const allMatches = await db.matches.toArray();

      // Mapa para busca ultra-rápida O(1)
      const matchMap = new Map(allMatches.map(m => [m.id, m]));

      // 🧠 O Sistema de Pesos Progressivos
      const stageWeights = {
        [TournamentStage.GROUP_STAGE]: 1,
        [TournamentStage.ROUND_OF_32]: 2,
        [TournamentStage.ROUND_OF_16]: 3,
        [TournamentStage.QUARTER_FINALS]: 4,
        [TournamentStage.SEMI_FINALS]: 5,
        [TournamentStage.THIRD_PLACE]: 5,
        [TournamentStage.FINAL]: 10,
      };

      // Recalcula o ranking de cada utilizador
      for (const user of users) {
        let totalPoints = 0;
        
        // Filtra apenas os palpites deste utilizador
        const userBets = allBets.filter(b => b.userId === user.id);

        for (const bet of userBets) {
          const match = matchMap.get(bet.matchId);

          // O palpite só gera pontos se o jogo real já tiver terminado (tiver placar)
          if (match && match.homeTeamGoals !== null && match.awayTeamGoals !== null) {
            
            // Placar Real
            const actualHome = match.homeTeamGoals;
            const actualAway = match.awayTeamGoals;
            
            // Placar do Palpite
            const betHome = bet.homeTeamGoals;
            const betAway = bet.awayTeamGoals;

            // Descobre quem ganhou na vida real e no palpite (HOME, AWAY, ou DRAW)
            const actualResult = actualHome > actualAway ? 'HOME' : actualHome < actualAway ? 'AWAY' : 'DRAW';

            if(betHome === null || betAway === null) continue;

            const betResult = betHome > betAway ? 'HOME' : betHome < betAway ? 'AWAY' : 'DRAW';

            // Regras de Pontuação Base
            const isExactScore = (actualHome === betHome && actualAway === betAway);
            const isCorrectOutcome = (actualResult === betResult);

            // Pega o multiplicador da fase atual (Padrão: 1)
            const multiplier = stageWeights[match.stage] || 1;

            if (isExactScore) {
              // Acertou na mosca: 3 pontos base * Multiplicador
              totalPoints += (3 * multiplier);
            } else if (isCorrectOutcome) {
              // Acertou no vencedor/empate, mas errou os golos: 1 ponto base * Multiplicador
              totalPoints += (1 * multiplier);
            }
          }
        }

        // Atualiza a pontuação total do utilizador no banco de dados
        await db.sweepstakesUsers.update(user.id!, { totalPoints });
      }
    });

    console.log("🎯 Ranking do Bolão atualizado com os novos pesos do Mata-mata!");
  },

  removeParticipant: async (userId: number) => {
    // Usamos uma transação envolvendo as duas tabelas para garantir a segurança dos dados
    await db.transaction('rw', [db.sweepstakesUsers, db.sweepstakesBets], async () => {
      // 1. Primeiro apagamos todos os palpites que pertencem a este utilizador
      await db.sweepstakesBets.where('userId').equals(userId).delete();
      
      // 2. Depois apagamos o próprio utilizador
      await db.sweepstakesUsers.delete(userId);
    });
  },
};

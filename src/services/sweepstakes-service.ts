import { db } from "../db/database";
import type { SweepstakesBet, SweepstakesUser } from "../types/bet";
import type { Match } from "../types/tournament";

const calculateBetPoints = (bet: SweepstakesBet, match: Match): number => {
  // 1. Se o jogo oficial ainda não aconteceu (null), ninguém ganha pontos
  if (match.homeTeamGoals === null || match.awayTeamGoals === null) return 0;

  // 2. Se a aposta está vazia, 0 pontos
  if (bet.homeTeamGoals === null || bet.awayTeamGoals === null) return 0;

  // 3. Regra de 3 Pontos: Placar exato
  const isExactMatch =
    bet.homeTeamGoals === match.homeTeamGoals &&
    bet.awayTeamGoals === match.awayTeamGoals;

  if (isExactMatch) return 3;

  // 4. Regra de 1 Ponto: Acertou o Vencedor ou o Empate
  const betGoalDiff = bet.homeTeamGoals - bet.awayTeamGoals;
  const matchGoalDiff = match.homeTeamGoals - match.awayTeamGoals;

  // Math.sign retorna: 1 (Número positivo = Casa venceu), -1 (Negativo = Fora venceu), 0 (Empate)
  // Se o "sinal" da aposta for igual ao "sinal" do jogo real, ele acertou a tendência!
  if (Math.sign(betGoalDiff) === Math.sign(matchGoalDiff)) {
    return 1;
  }

  // 5. Errou tudo
  return 0;
};

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

  recalculateAllBolaoScores: async () => {
    // Trazemos tudo para a memória. Como o Dexie é local e rápido, isto leva milissegundos.
    const allUsers = await db.sweepstakesUsers.toArray();
    const allBets = await db.sweepstakesBets.toArray();
    const allMatches = await db.matches.toArray();

    // Criamos um mapa (Dicionário) de jogos para acesso ultra-rápido: O(1)
    const matchesMap = new Map(allMatches.map((m) => [m.id, m]));

    // Arrays para guardarmos o que precisa de ser atualizado na base de dados
    const usersToUpdate: SweepstakesUser[] = [];
    const betsToUpdate: SweepstakesBet[] = [];

    // Para cada utilizador, calculamos a sua vida
    for (const user of allUsers) {
      if (!user.id) continue;

      let userTotalPoints = 0;

      // Filtramos apenas as apostas deste utilizador
      const userBets = allBets.filter((b) => b.userId === user.id);

      for (const bet of userBets) {
        const officialMatch = matchesMap.get(bet.matchId);

        if (officialMatch) {
          const earnedPoints = calculateBetPoints(bet, officialMatch);

          // Se os pontos da aposta mudaram, guardamos para atualizar no banco
          if (bet.pointsEarned !== earnedPoints) {
            bet.pointsEarned = earnedPoints;
            betsToUpdate.push(bet);
          }

          userTotalPoints += earnedPoints;
        }
      }

      // Se o total do utilizador mudou, guardamos para atualizar
      if (user.totalPoints !== userTotalPoints) {
        user.totalPoints = userTotalPoints;
        usersToUpdate.push(user);
      }
    }

    // Salva tudo no banco de dados usando o super poder do bulkPut (Lote)
    await db.transaction(
      "rw",
      [db.sweepstakesUsers, db.sweepstakesBets],
      async () => {
        if (betsToUpdate.length > 0)
          await db.sweepstakesBets.bulkPut(betsToUpdate);
        if (usersToUpdate.length > 0)
          await db.sweepstakesUsers.bulkPut(usersToUpdate);
      },
    );

    console.log("🏆 Ranking do Bolão atualizado com sucesso!");
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

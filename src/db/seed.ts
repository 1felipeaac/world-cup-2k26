import { Groups } from "../model/groups";
import { StandingMatches } from "../model/standing-matches";
import { Teams } from "../model/teams";
import { db } from "./database";

export async function initializeDatabase() {
  const teamsCount = await db.teams.count();

  // Se o banco estiver vazio, fazemos o Seed
  if (teamsCount === 0) {
    console.log("Inicializando banco de dados pela primeira vez...");

    // Transação em lote (bulkAdd) é extremamente rápida no IndexedDB
    await db.transaction(
      "rw",
      [db.teams, db.groups, db.rounds, db.matches],
      async () => {
        // Trocando Add por Put: Resolve o erro de Constraint
        await db.teams.bulkPut(Teams);
        await db.groups.bulkPut(Groups);
        await db.rounds.bulkPut(StandingMatches);

        const allMatches = StandingMatches.flatMap((round) => round.matches);
        await db.matches.bulkPut(allMatches);
      },
    );

    console.log("Seed concluído com sucesso!");
  }
}

import { Groups } from "../model/groups";
import { StandingMatches } from "../model/standing-matches";
import { Teams } from "../model/teams";
import { db } from "./database";

export async function initializeDatabase() {
  const teamsCount = await db.teams.count();

  
  if (teamsCount === 0) {
    console.log("Inicializando banco de dados pela primeira vez...");

    
    await db.transaction(
      "rw",
      [db.teams, db.groups, db.rounds, db.matches],
      async () => {
        
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

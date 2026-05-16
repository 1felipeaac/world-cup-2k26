import Dexie, { type Table } from "dexie";
import type { Group, Match, Round, Team } from "../types/tournament";
import type { SweepstakesBet, SweepstakesUser } from "../types/bet";


export class CopaDatabase extends Dexie {

  teams!: Table<Team, number>;
  groups!: Table<Group, number>;
  matches!: Table<Match, number>;
  rounds!: Table<Round, number>;

  sweepstakesUsers!: Table<SweepstakesUser, number>;
  sweepstakesBets!: Table<SweepstakesBet, number>;

  constructor() {
    super('CopaSimulatorDB');

    this.version(1).stores({
      teams: 'id, name',
      groups: 'id, name',
      matches: 'id, stage, roundId, groupId, homeTeamId, awayTeamId',
      rounds: 'id'
    });

    this.version(2).stores({
      teams: 'id, name',
      groups: 'id, name',
    
      matches: 'id, stage, roundId, groupId, [groupId+roundId], homeTeamId, awayTeamId',
      rounds: 'id',
      
      sweepstakesUsers: '++id, name, totalPoints',
      
      sweepstakesBets: '++id, userId, matchId, [userId+matchId]'
    });
  }
}

export const db = new CopaDatabase();
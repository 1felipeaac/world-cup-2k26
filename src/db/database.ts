import Dexie, { type Table } from "dexie";
import type { Group, Match, Round, Team } from "../model/tournament";


export class CopaDatabase extends Dexie {

  teams!: Table<Team, number>;
  groups!: Table<Group, number>;
  matches!: Table<Match, number>;
  rounds!: Table<Round, number>;

  constructor() {
    super('CopaSimulatorDB');

    this.version(1).stores({
      teams: 'id, name',
      groups: 'id, name',
      matches: 'id, stage, roundId, groupId, homeTeamId, awayTeamId',
      rounds: 'id'
    });
  }
}

export const db = new CopaDatabase();
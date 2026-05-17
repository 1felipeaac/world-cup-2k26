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

    this.version(3).stores({
      teams: 'id, name',
      groups: 'id, name',
      matches: 'id, stage, roundId, groupId, [groupId+roundId], homeTeamId, awayTeamId',
      rounds: 'id',
      sweepstakesUsers: '++id, name, totalPoints',
      sweepstakesBets: '++id, userId, matchId, [userId+matchId]'
    }).upgrade(async (trans) => {
      
      const abbreviationsMap: Record<string, string> = {
        "Argentina": "ARG", "Brasil": "BRA", "Colômbia": "COL",
        "Equador": "ECU", "Paraguai": "PAR", "Uruguai": "URU",
        "Canadá": "CAN", "Curaçao": "CUR", "Estados Unidos": "USA",
        "Haiti": "HAI", "Mexico": "MEX", "Panamá": "PAN",
        "Alemanha": "GER", "Austria": "AUT", "Belgica": "BEL",
        "Bósnia e Herzegovina": "BIH", "Croácia": "CRO", "Escócia": "SCO",
        "Espanha": "ESP", "França": "FRA", "Holanda": "NED",
        "Inglaterra": "ENG", "Noruega": "NOR", "Portugal": "POR",
        "República Tcheca": "CZE", "Suécia": "SWE", "Suíça": "SUI",
        "Turquia": "TUR", "Arábia Saudita": "KSA", "Austrália": "AUS",
        "Catar": "QAT", "Coréia do Sul": "KOR", "Iran": "IRN",
        "Iraque": "IRQ", "Japão": "JPN", "Jordânia": "JOR",
        "Uzbequistão": "UZB", "Nova Zelândia": "NZL", "África do Sul": "RSA",
        "Argélia": "ALG", "Cabo Verde": "CPV", "Costa do Marfim": "CIV",
        "Egito": "EGY", "Gana": "GHA", "Marrocos": "MAR",
        "Congo": "COD", "Senegal": "SEN", "Tunísia": "TUN"
      };

      await trans.table('teams').toCollection().modify(team => {
        if (!team.abbreviation) {
          team.abbreviation = abbreviationsMap[team.name] || team.name.substring(0, 3).toUpperCase();
        }
      });
    });
  }
}

export const db = new CopaDatabase();
export enum MatchResult{
    WIN = 'WIN',
    LOSS = 'LOSS',
    DRAW = 'DRAW',
    NOT_PLAYED = 'NOT_PLAYED'
}

export enum TournamentStage {
    GROUP_STAGE = 'GROUP_STAGE',
    ROUND_OF_32 = 'ROUND_OF_32', 
    ROUND_OF_16 = 'ROUND_OF_16', 
    QUARTER_FINALS = 'QUARTER_FINALS',
    SEMI_FINALS = 'SEMI_FINALS',
    FINAL = 'FINAL'
}

export interface Stats{
    wins: number,
    losses: number,
    draws: number,
    goalsFor: number,
    goalsAgainst: number,
    goalDifference: number,
    points: number,
    recentForm?: MatchResult[]
}

export interface Team {
    id: number,
    logoUrl: string,
    name: string,
    stats: Stats
}

export interface Group {
    id: number,
    name: string,
    teams: Team[],
    matches: Match[]
}

export interface Tournament {
    id: number,
    name: string,
    groups: Group[],
    rounds: Round[]
}

export interface Match {
    id: number,
    stage: TournamentStage,
    roundId?: number,
    groupId?: number,
    homeTeamId: number,
    awayTeamId: number,
    homeTeamGoals: number,
    awayTeamGoals: number,
    date: Date
}

export interface Round {
  id: number,
  matches: Match[]
}
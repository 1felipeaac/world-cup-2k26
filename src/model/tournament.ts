export enum QualifiedNextRound{
    WINS = 'WINS',
    LOSSES = 'LOSSES',
    DRAWS = 'DRAWS',
    NOT_PLAYED = 'NOT_PLAYED'
}

export enum TournamentStage {
    GROUP_STAGE = 'GROUP_STAGE',
    ROUND_OF_32 = 'ROUND_OF_32', // Dezesseis avos
    ROUND_OF_16 = 'ROUND_OF_16', // Oitavas
    QUARTER_FINALS = 'QUARTER_FINALS', // Quartas
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
    qualifiedNextRound?: QualifiedNextRound[]
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
    matches: Match[]
}

export interface Match {
    id: number,
    stage: TournamentStage,
    round?: number,
    groupId?: number,
    homeTeamId: number,
    awayTeamId: number,
    homeTeamGoals: number,
    awayTeamGoals: number,
    date: Date
}
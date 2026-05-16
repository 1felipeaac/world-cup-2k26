export interface SweepstakesUser {
  id?: number; 
  name: string;
  avatarUrl?: string;
  totalPoints: number; 
}

export interface SweepstakesBet {
  id?: number;
  userId: number; 
  matchId: number; 
  homeTeamGoals: number | null;
  awayTeamGoals: number | null;
  pointsEarned: number; 
}
export type Team = 'blue' | 'pink' | 'orange' | 'purple' | 'green';

export interface Pixel {
  x: number;
  y: number;
  team: Team;
  last_painted_at?: string;
}

export interface LeaderboardEntry {
  team: Team;
  count: number;
  color: string;
}

export interface PaintPayload {
  x: number;
  y: number;
  team: Team;
} 
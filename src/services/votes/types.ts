
export type VoteType = 'up' | 'down' | null;
export type EntityType = 'ensemble' | 'tenue' | 'defi';

export interface VoteCount {
  up: number;
  down: number;
}

export const calculateScore = (counts: VoteCount): number => {
  return counts.up - counts.down;
};

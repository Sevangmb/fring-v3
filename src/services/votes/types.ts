
export type VoteType = 'up' | 'down' | null;

export type EntityType = 'ensemble' | 'defi' | 'tenue';

export interface VoteCount {
  up: number;
  down: number;
}

/**
 * Calcule le score basé sur les votes positifs et négatifs
 */
export const calculateScore = (votes: VoteCount): number => {
  return votes.up - votes.down;
};

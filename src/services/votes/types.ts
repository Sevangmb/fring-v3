
/**
 * Types de vote possibles
 */
export type VoteType = 'up' | 'down' | null;

/**
 * Types d'entités pour lesquelles on peut voter
 */
export type EntityType = 'ensemble' | 'defi' | 'tenue';

/**
 * Structure pour le décompte des votes
 */
export interface VoteCount {
  up: number;
  down: number;
}

/**
 * Calcule le score à partir des votes (up - down)
 */
export const calculateScore = (votes: VoteCount): number => {
  return votes.up - votes.down;
};

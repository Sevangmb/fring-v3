
/**
 * Type de vote
 */
export type VoteType = 'up' | 'down' | null;

/**
 * Type d'entité
 */
export type EntityType = 'ensemble' | 'tenue' | 'defi';

/**
 * Comptage des votes
 */
export interface VoteCount {
  up: number;
  down: number;
}

/**
 * Calcule le score à partir du comptage des votes
 */
export const calculateScore = (votes: VoteCount): number => {
  return votes.up - votes.down;
};


/**
 * Types de vote possibles
 */
export type VoteType = 'up' | 'down' | null;

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

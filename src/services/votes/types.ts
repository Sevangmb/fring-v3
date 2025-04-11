
/**
 * Type pour représenter un vote (up, down ou null pour pas de vote)
 */
export type VoteType = "up" | "down" | null;

/**
 * Type pour les entités pouvant être votées
 */
export type EntityType = "ensemble" | "defi" | "tenue";

/**
 * Structure pour le comptage des votes
 */
export interface VoteCount {
  up: number;
  down: number;
}

/**
 * Calcule le score à partir du nombre de votes
 */
export const calculateScore = (votes: VoteCount): number => {
  return votes.up - votes.down;
};

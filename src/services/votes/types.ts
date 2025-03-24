
/**
 * Types de vote possibles
 */
export type VoteType = 'up' | 'down' | null;

/**
 * Types d'entités sur lesquelles on peut voter
 */
export type EntityType = 'vetement' | 'ensemble' | 'defi';

/**
 * Interface pour le comptage des votes
 */
export interface VotesCount {
  up: number;
  down: number;
}

/**
 * Options pour les fonctions de vote
 */
export interface VoteOptions {
  tableName?: string;
  userIdField?: string;
  entityIdField?: string;
  voteField?: string;
  extraFields?: Record<string, any>;
}

/**
 * Calculer un score à partir des votes
 */
export const calculateScore = (votes: VotesCount): number => {
  return votes.up - votes.down;
};


export type VoteType = 'up' | 'down' | null;

export type EntityType = 'vetement' | 'tenue' | 'defi';

export interface VotesCount {
  up: number;
  down: number;
}

export interface VoteOptions {
  tableName?: string;
  entityIdField?: string;
  voteField?: string;
}

// Utility function to calculate score from votes
export const calculateScore = (votes: VotesCount): number => {
  // Simple score calculation: only count up votes
  return votes.up;
};

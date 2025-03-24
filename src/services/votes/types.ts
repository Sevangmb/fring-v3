
export type VoteType = 'up' | 'down' | null;

export type EntityType = 'vetement' | 'ensemble' | 'defi';

export interface VotesCount {
  up: number;
  down: number;
}

export interface VoteOptions {
  tableName?: string;
  entityIdField?: string;
  userIdField?: string;
  voteField?: string;
  extraFields?: Record<string, any>;
}

// Helper function to calculate score from votes
export const calculateScore = (votes: VotesCount): number => {
  return votes.up - votes.down;
};

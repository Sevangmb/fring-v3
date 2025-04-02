
export type VoteType = 'up' | 'down' | null;
export type VoteCount = { up: number; down: number; };

export const calculateScore = (counts: VoteCount): number => {
  return counts.up - counts.down;
};

export interface DefiVote {
  defi_id: number;
  ensemble_id?: number;
  user_id: string;
  vote_type: 'up' | 'down' | null;
  created_at: string;
}

export interface DefiVoteCounts {
  up: number;
  down: number;
  total: number;
}

export interface DefiVoteSummary {
  ensembleId: number;
  totalVotes: number;
  upvotes: number;
  downvotes: number;
  score: number;
  userVote: 'up' | 'down' | null;
}

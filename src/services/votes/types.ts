
export type VoteType = 'up' | 'down' | null;

export interface VoteCount {
  up: number;
  down: number;
}

export interface ElementVotes {
  userVote: VoteType;
  votesCount: VoteCount;
}

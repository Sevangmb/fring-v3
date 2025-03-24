
export type VoteType = 'up' | 'down' | null;

export type EntityType = 'vetement' | 'ensemble' | 'defi';

export interface VotesCount {
  up: number;
  down: number;
}

export const calculateScore = (votes: VotesCount): number => {
  return (votes.up || 0) - (votes.down || 0);
};


export type VoteType = 'up' | 'down' | null;

export interface VoteCount {
  up: number;
  down: number;
}

export interface ElementVotes {
  userVote: VoteType;
  votesCount: VoteCount;
}

// Ajout des types manquants
export type EntityType = 'ensemble' | 'defi' | 'tenue';

export const calculateScore = (votes: VoteCount): number => {
  return votes.up - votes.down;
};

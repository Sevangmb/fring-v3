
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

// Fonction pour calculer le pourcentage de votes positifs
export const calculatePositivePercentage = (votes: VoteCount): number => {
  const total = votes.up + votes.down;
  if (total === 0) return 0;
  return Math.round((votes.up / total) * 100);
};

// Fonction pour formater le score à la façon de Reddit
export const formatRedditScore = (score: number): string => {
  if (score >= 1000) {
    return `${(score / 1000).toFixed(1)}k`;
  }
  return String(score);
};

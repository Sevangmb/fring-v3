
export * from '@/services/votes/types';

export interface ParticipationWithVotes {
  id: number;
  defi_id: number;
  user_id: string;
  ensemble_id: number;
  created_at: string;
  commentaire?: string;
  tenue: {
    id: number;
    nom: string;
    description?: string;
    occasion?: string;
    saison?: string;
    created_at: string;
    user_id: string;
    vetements: {
      id: number;
      vetement: any;
    }[];
  };
  user_email?: string;
  votes: {
    userVote: 'up' | 'down' | null;
    votesCount: {
      up: number;
      down: number;
    };
  };
  score?: number;
}

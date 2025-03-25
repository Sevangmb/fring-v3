
import { VoteType } from "@/services/votes/types";

export interface DefiVoteOptions {
  defiId: number;
  ensembleId: number;
  userId?: string;
}

export interface ParticipationWithVotes {
  id: number;
  defi_id: number;
  user_id: string;
  ensemble_id: number;
  commentaire?: string;
  created_at: string;
  ensemble: any;
  votes: {
    up: number;
    down: number;
  };
  score: number;
}


import { getUserVote as baseGetUserVote } from "@/services/votes/getUserVote";
import { VoteType } from "@/services/votes/types";

/**
 * Récupérer le vote d'un utilisateur pour un ensemble
 */
export const getUserVote = async (ensembleId: number): Promise<VoteType> => {
  return baseGetUserVote('ensemble', ensembleId);
};


import { submitVote as baseSubmitVote } from "@/services/votes/submitVote";
import { getUserVote as baseGetUserVote } from "@/services/votes/getUserVote";
import { getVotesCount as baseGetVotesCount } from "@/services/votes/getVotesCount";
import { VoteType } from "@/services/votes/types";

/**
 * Soumettre un vote pour un ensemble
 */
export const submitVote = async (ensembleId: number, vote: VoteType): Promise<boolean> => {
  return baseSubmitVote('ensemble', ensembleId, vote);
};

/**
 * Récupérer le vote d'un utilisateur pour un ensemble
 */
export const getUserVote = async (ensembleId: number): Promise<VoteType> => {
  return baseGetUserVote('ensemble', ensembleId);
};

/**
 * Récupérer le nombre de votes pour un ensemble
 */
export const getVotesCount = async (ensembleId: number) => {
  return baseGetVotesCount('ensemble', ensembleId);
};

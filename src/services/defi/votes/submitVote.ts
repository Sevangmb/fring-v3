
import { submitVote as baseSubmitVote } from '@/services/votes/submitVote';
import { VoteType } from './types';

/**
 * Soumettre un vote pour un défi
 */
export const submitVote = async (
  defiId: number, 
  vote: VoteType, 
  ensembleId?: number
): Promise<boolean> => {
  return baseSubmitVote('defi', defiId, vote, ensembleId);
};

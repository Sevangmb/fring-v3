
import { getUserVote as baseGetUserVote } from '@/services/votes/getUserVote';
import { VoteType } from './types';

/**
 * Récupérer le vote d'un utilisateur pour un défi
 */
export const getUserVote = async (
  defiId: number, 
  ensembleId?: number
): Promise<VoteType> => {
  return baseGetUserVote('defi', defiId, ensembleId);
};

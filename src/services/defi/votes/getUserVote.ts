
import { supabase } from '@/lib/supabase';
import { VoteType } from '@/services/votes/types';

/**
 * Récupère le vote d'un utilisateur pour un ensemble dans le cadre d'un défi
 * @param defiId ID du défi
 * @param ensembleId ID de l'ensemble
 * @param userId ID de l'utilisateur (optionnel, utilise l'utilisateur courant si non spécifié)
 * @returns Le type de vote ou null si l'utilisateur n'a pas voté
 */
export const getUserVote = async (
  defiId: number,
  ensembleId: number,
  userId?: string
): Promise<VoteType> => {
  try {
    // Si userId n'est pas spécifié, obtenir l'utilisateur courant
    if (!userId) {
      const { data: sessionData } = await supabase.auth.getSession();
      userId = sessionData.session?.user?.id;
      
      if (!userId) {
        // Pas d'utilisateur connecté
        return null;
      }
    }
    
    console.log(`Getting vote for defi ${defiId}, ensemble ${ensembleId}, user ${userId}`);
    
    // Récupérer le vote pour l'ensemble dans le défi
    const { data, error } = await supabase
      .from('defi_votes')
      .select('vote_type')
      .eq('defi_id', defiId)
      .eq('tenue_id', ensembleId)
      .eq('user_id', userId)
      .maybeSingle();
    
    if (error) {
      console.error('Error getting user vote:', error);
      return null;
    }
    
    return data?.vote_type || null;
  } catch (error) {
    console.error('Error getting user vote:', error);
    return null;
  }
};

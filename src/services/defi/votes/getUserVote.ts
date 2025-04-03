
import { supabase } from '@/lib/supabase';
import { VoteType } from '@/services/votes/types';

/**
 * Récupère le vote d'un utilisateur pour un ensemble dans un défi
 * @param defiId ID du défi
 * @param ensembleId ID de l'ensemble
 * @param userId ID de l'utilisateur (optionnel, utilise l'utilisateur courant si non fourni)
 * @returns Le type de vote ou null si l'utilisateur n'a pas voté
 */
export const getUserVote = async (
  defiId: number,
  ensembleId: number,
  userId?: string
): Promise<VoteType> => {
  try {
    // Si l'ID utilisateur n'est pas fourni, obtenir l'utilisateur courant
    if (!userId) {
      const { data: sessionData } = await supabase.auth.getSession();
      userId = sessionData.session?.user?.id;
      
      if (!userId) {
        return null;
      }
    }

    // Récupérer le vote de l'utilisateur
    const { data, error } = await supabase
      .from('defi_votes')
      .select('vote_type')
      .eq('defi_id', defiId)
      .eq('ensemble_id', ensembleId)
      .eq('user_id', userId)
      .single();
    
    if (error) {
      // Si l'erreur est due à l'absence de résultat, renvoyer null
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('Erreur lors de la récupération du vote:', error);
      return null;
    }

    return data.vote_type;
  } catch (error) {
    console.error('Erreur lors de la récupération du vote:', error);
    return null;
  }
};

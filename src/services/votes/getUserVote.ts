
import { supabase } from '@/lib/supabase';
import { VoteType } from './types';

/**
 * Récupère le vote d'un utilisateur pour un élément
 * @param elementType Type d'élément ('ensemble' ou 'defi')
 * @param elementId ID de l'élément
 * @param ensembleId ID de l'ensemble (uniquement pour les votes dans un défi)
 * @returns Type de vote ou null si pas de vote
 */
export const getUserVote = async (
  elementType: 'ensemble' | 'defi', 
  elementId: number, 
  ensembleId?: number
): Promise<VoteType> => {
  try {
    // Vérifier que l'utilisateur est connecté
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    
    if (!userId) {
      return null;
    }
    
    // Cas spécial: vote pour un ensemble dans un défi
    if (elementType === 'defi' && ensembleId !== undefined) {
      const { data, error } = await supabase
        .from('defi_votes')
        .select('vote_type')
        .eq('defi_id', elementId)
        .eq('tenue_id', ensembleId)
        .eq('user_id', userId)
        .maybeSingle();
      
      if (error) {
        console.error('Erreur lors de la récupération du vote:', error);
        return null;
      }
      
      return data?.vote_type || null;
    }
    
    // Votes standards
    const tableName = `${elementType}_votes`;
    const idColumnName = `${elementType}_id`;
    
    // Pour la table ensemble_votes, on doit utiliser "vote" au lieu de "vote_type"
    const voteColumnName = tableName === 'ensemble_votes' ? 'vote' : 'vote_type';
    
    const { data, error } = await supabase
      .from(tableName)
      .select(voteColumnName)
      .eq(idColumnName, elementId)
      .eq('user_id', userId)
      .maybeSingle();
    
    if (error) {
      console.error('Erreur lors de la récupération du vote:', error);
      return null;
    }
    
    return data?.[voteColumnName] || null;
  } catch (error) {
    console.error('Erreur lors de la récupération du vote:', error);
    return null;
  }
};


import { supabase } from '@/lib/supabase';
import { VoteType } from './types';

/**
 * Soumettre un vote pour un élément (ensemble, défi, etc.)
 */
export const submitVote = async (
  elementType: 'ensemble' | 'defi', 
  elementId: number, 
  vote: VoteType, 
  ensembleId?: number
): Promise<boolean> => {
  try {
    // Vérifier que l'utilisateur est connecté
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    
    if (!userId) {
      throw new Error('Vous devez être connecté pour voter');
    }
    
    // Déterminer la table et les données en fonction du type d'élément
    const tableName = `${elementType}_votes`;
    let data: Record<string, any>;
    
    if (elementType === 'ensemble') {
      data = {
        user_id: userId,
        ensemble_id: elementId,
        vote_type: vote
      };
    } else if (elementType === 'defi') {
      data = {
        user_id: userId,
        defi_id: elementId,
        vote_type: vote
      };
      
      // Si on vote pour un ensemble spécifique dans un défi
      if (ensembleId !== undefined) {
        data.tenue_id = ensembleId;
      }
    }
    
    // Vérifier si l'utilisateur a déjà voté
    let query = supabase.from(tableName).select('id');
    
    if (elementType === 'ensemble') {
      query = query.eq('ensemble_id', elementId);
    } else if (elementType === 'defi') {
      query = query.eq('defi_id', elementId);
      if (ensembleId !== undefined) {
        query = query.eq('tenue_id', ensembleId);
      }
    }
    
    const { data: existingVote } = await query.eq('user_id', userId).maybeSingle();
    
    if (existingVote) {
      // Mettre à jour le vote existant
      const { error } = await supabase
        .from(tableName)
        .update({ vote_type: vote })
        .eq('id', existingVote.id);
      
      if (error) throw error;
    } else {
      // Créer un nouveau vote
      const { error } = await supabase
        .from(tableName)
        .insert([data]);
      
      if (error) throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Erreur lors de la soumission du vote:', error);
    return false;
  }
};

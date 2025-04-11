
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
      if (ensembleId !== undefined) {
        // Pour les votes sur des ensembles dans un défi
        // Utiliser le service spécifique pour ce cas
        const { submitVote: submitDefiVote } = await import('@/services/defi/votes/submitVote');
        return await submitDefiVote(elementId, ensembleId, vote);
      } else {
        // Pour les votes sur des défis uniquement
        data = {
          user_id: userId,
          defi_id: elementId,
          vote_type: vote
        };
      }
    }
    
    // Vérifier si l'utilisateur a déjà voté
    let query = supabase.from(tableName).select('id, vote_type');
    
    if (elementType === 'ensemble') {
      query = query.eq('ensemble_id', elementId);
    } else if (elementType === 'defi' && !ensembleId) { 
      query = query.eq('defi_id', elementId);
    }
    
    const { data: existingVote, error: queryError } = await query
      .eq('user_id', userId)
      .maybeSingle();
    
    if (queryError) {
      console.error('Erreur lors de la vérification du vote:', queryError);
      return false;
    }
    
    if (existingVote) {
      // Si le vote est identique, ne rien faire
      if (existingVote.vote_type === vote) {
        return true;
      }
      
      // Mettre à jour le vote existant
      const { error } = await supabase
        .from(tableName)
        .update({ vote_type: vote })
        .eq('id', existingVote.id);
      
      if (error) {
        console.error('Erreur lors de la mise à jour du vote:', error);
        return false;
      }
    } else {
      // Créer un nouveau vote
      const { error } = await supabase
        .from(tableName)
        .insert([data]);
      
      if (error) {
        console.error('Erreur lors de l\'ajout du vote:', error);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Erreur lors de la soumission du vote:', error);
    return false;
  }
};

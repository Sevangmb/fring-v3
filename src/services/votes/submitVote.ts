
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
    const data: any = {
      user_id: userId,
      vote: vote
    };
    
    // Ajouter les IDs appropriés selon le type d'élément
    if (elementType === 'ensemble') {
      data.ensemble_id = elementId;
    } else if (elementType === 'defi') {
      data.defi_id = elementId;
      // Si on vote pour un ensemble spécifique dans un défi
      if (ensembleId) {
        data.ensemble_id = ensembleId;
      }
    }
    
    // Vérifier si l'utilisateur a déjà voté
    const { data: existingVote } = await supabase
      .from(tableName)
      .select('id')
      .eq(elementType === 'ensemble' ? 'ensemble_id' : 'defi_id', elementId)
      .eq('user_id', userId)
      .maybeSingle();
    
    if (existingVote) {
      // Mettre à jour le vote existant
      const { error } = await supabase
        .from(tableName)
        .update({ vote })
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

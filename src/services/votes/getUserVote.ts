
import { supabase } from '@/lib/supabase';
import { VoteType } from './types';

/**
 * Récupère le vote d'un utilisateur pour un élément
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
    
    // Déterminer la table et les conditions en fonction du type d'élément
    const tableName = `${elementType}_votes`;
    let query = supabase
      .from(tableName)
      .select('vote')
      .eq(elementType === 'ensemble' ? 'ensemble_id' : 'defi_id', elementId)
      .eq('user_id', userId);
    
    // Si on vérifie un vote pour un ensemble spécifique dans un défi
    if (elementType === 'defi' && ensembleId !== undefined) {
      query = query.eq('ensemble_id', ensembleId);
    } else if (elementType === 'defi') {
      query = query.is('ensemble_id', null);
    }
    
    const { data, error } = await query.maybeSingle();
    
    if (error) throw error;
    
    return data?.vote as VoteType || null;
  } catch (error) {
    console.error('Erreur lors de la récupération du vote:', error);
    return null;
  }
};

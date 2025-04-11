
import { supabase } from '@/lib/supabase';
import { VoteCount } from './types';

/**
 * Récupère le nombre de votes pour un élément
 */
export const getVotesCount = async (
  elementType: 'ensemble' | 'defi', 
  elementId: number, 
  ensembleId?: number
): Promise<VoteCount> => {
  try {
    // Déterminer la table et les conditions en fonction du type d'élément
    const tableName = `${elementType}_votes`;
    let query = supabase
      .from(tableName)
      .select('vote_type');
    
    // Ajouter les conditions appropriées selon le type d'élément
    if (elementType === 'ensemble') {
      query = query.eq('ensemble_id', elementId);
    } else if (elementType === 'defi') {
      query = query.eq('defi_id', elementId);
      
      // Si on compte les votes pour un ensemble spécifique dans un défi
      if (ensembleId !== undefined) {
        query = query.eq('tenue_id', ensembleId);
      }
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    // Compter les votes positifs et négatifs
    const upVotes = data.filter(v => v.vote_type === 'up').length;
    const downVotes = data.filter(v => v.vote_type === 'down').length;
    
    return {
      up: upVotes,
      down: downVotes
    };
  } catch (error) {
    console.error('Erreur lors de la récupération du nombre de votes:', error);
    return { up: 0, down: 0 };
  }
};

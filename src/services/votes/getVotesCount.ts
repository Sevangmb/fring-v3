
import { supabase } from '@/lib/supabase';
import { VoteCount } from './types';

/**
 * Récupère le nombre de votes positifs et négatifs pour un élément
 * @param elementType Type d'élément ('ensemble' ou 'defi')
 * @param elementId ID de l'élément
 * @param ensembleId ID de l'ensemble (uniquement pour les votes dans un défi)
 * @returns Compteur de votes
 */
export const getVotesCount = async (
  elementType: 'ensemble' | 'defi', 
  elementId: number, 
  ensembleId?: number
): Promise<VoteCount> => {
  try {
    // Cas spécial: votes pour un ensemble dans un défi
    if (elementType === 'defi' && ensembleId !== undefined) {
      const { data, error } = await supabase
        .from('defi_votes')
        .select('vote_type')
        .eq('defi_id', elementId)
        .eq('tenue_id', ensembleId);
      
      if (error) {
        console.error('Erreur lors de la récupération des votes:', error);
        return { up: 0, down: 0 };
      }
      
      const upVotes = data.filter(v => v.vote_type === 'up').length;
      const downVotes = data.filter(v => v.vote_type === 'down').length;
      
      return { up: upVotes, down: downVotes };
    }
    
    // Votes standards
    const tableName = `${elementType}_votes`;
    const idColumnName = `${elementType}_id`;
    
    const { data, error } = await supabase
      .from(tableName)
      .select('vote_type')
      .eq(idColumnName, elementId);
    
    if (error) {
      console.error('Erreur lors de la récupération des votes:', error);
      return { up: 0, down: 0 };
    }
    
    const upVotes = data.filter(v => v.vote_type === 'up').length;
    const downVotes = data.filter(v => v.vote_type === 'down').length;
    
    return { up: upVotes, down: downVotes };
  } catch (error) {
    console.error('Erreur lors de la récupération des votes:', error);
    return { up: 0, down: 0 };
  }
};

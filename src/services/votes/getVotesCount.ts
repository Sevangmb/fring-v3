
import { supabase } from '@/lib/supabase';
import { EntityType } from './types';

/**
 * Récupère le nombre de votes pour un élément
 * @param elementType Type d'élément ('ensemble' ou 'defi')
 * @param elementId ID de l'élément
 * @param ensembleId ID de l'ensemble (uniquement pour les votes dans un défi)
 * @returns Nombre de votes positifs et négatifs
 */
export const getVotesCount = async (
  elementType: EntityType, 
  elementId: number,
  ensembleId?: number
): Promise<{ up: number; down: number }> => {
  try {
    // Si le type est "tenue", utiliser "ensemble" pour la table
    const effectiveType = elementType === "tenue" ? "ensemble" : elementType;
    
    // Cas spécial: vote pour un ensemble dans un défi
    if (effectiveType === 'defi' && ensembleId !== undefined) {
      const { data, error } = await supabase
        .from('defi_votes')
        .select('vote_type')
        .eq('defi_id', elementId)
        .eq('tenue_id', ensembleId);
      
      if (error) {
        console.error('Erreur lors du comptage des votes:', error);
        return { up: 0, down: 0 };
      }
      
      const upVotes = data?.filter(v => v.vote_type === 'up').length || 0;
      const downVotes = data?.filter(v => v.vote_type === 'down').length || 0;
      
      return { up: upVotes, down: downVotes };
    }
    
    // Pour les votes standards
    const tableName = `${effectiveType}_votes`;
    const idColumnName = `${effectiveType}_id`;
    
    // Le nom du champ contenant le vote dépend de la table
    const voteColumnName = tableName === 'ensemble_votes' ? 'vote' : 'vote_type';
    
    const { data, error } = await supabase
      .from(tableName)
      .select(voteColumnName)
      .eq(idColumnName, elementId);
      
    if (error) {
      console.error('Erreur lors du comptage des votes:', error);
      return { up: 0, down: 0 };
    }
    
    const upVotes = data?.filter(v => v[voteColumnName] === 'up').length || 0;
    const downVotes = data?.filter(v => v[voteColumnName] === 'down').length || 0;
    
    return { up: upVotes, down: downVotes };
  } catch (error) {
    console.error('Erreur lors du comptage des votes:', error);
    return { up: 0, down: 0 };
  }
};

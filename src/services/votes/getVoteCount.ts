
import { supabase } from '@/lib/supabase';

interface VoteCount {
  up: number;
  down: number;
}

/**
 * Récupère le nombre de votes positifs et négatifs pour une entité
 * @param entityType Type de l'entité ('ensemble' ou 'tenue')
 * @param entityId ID de l'entité
 * @returns Nombre de votes positifs et négatifs
 */
export const getVoteCount = async (
  entityType: 'ensemble' | 'tenue' | 'defi',
  entityId: number
): Promise<VoteCount> => {
  try {
    let tableName: string;
    let columnName: string;
    
    // Déterminer la table et la colonne selon le type d'entité
    if (entityType === 'ensemble' || entityType === 'tenue') {
      tableName = 'ensemble_votes';
      columnName = 'ensemble_id';
    } else {
      tableName = 'defi_votes';
      columnName = 'defi_id';
    }
    
    console.log(`Getting votes count for ${entityType} ${entityId} from ${tableName}`);
    
    // Récupérer tous les votes pour l'entité
    const { data, error } = await supabase
      .from(tableName)
      .select('vote')
      .eq(columnName, entityId);
    
    if (error) {
      console.error('Error fetching vote count:', error);
      return { up: 0, down: 0 };
    }
    
    if (!data) {
      return { up: 0, down: 0 };
    }
    
    // Compter les votes positifs et négatifs
    const upVotes = data.filter(vote => vote.vote === 'up').length;
    const downVotes = data.filter(vote => vote.vote === 'down').length;
    
    console.log(`Vote count for ${entityType} ${entityId}: ${upVotes} up, ${downVotes} down`);
    
    return {
      up: upVotes,
      down: downVotes
    };
  } catch (error) {
    console.error('Error getting vote count:', error);
    return { up: 0, down: 0 };
  }
};

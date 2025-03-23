
import { supabase } from "@/lib/supabase";
import { EntityType, VoteOptions, VotesCount } from "./types";
import { fetchWithRetry } from "../network/retryUtils";
import { isValidEntityId, isOnline } from "./utils/voteUtils";

/**
 * Obtenir tous les votes pour une entité
 */
export const getVotesCount = async (
  entityType: EntityType,
  entityId: number | undefined,
  options?: VoteOptions
): Promise<VotesCount> => {
  try {
    // Verify that entityId is provided
    if (!isValidEntityId(entityId)) {
      console.warn("ID de l'entité manquant lors de la récupération des votes");
      return { up: 0, down: 0 };
    }
    
    if (!isOnline()) {
      console.warn('Pas de connexion Internet, impossible de récupérer les votes');
      return { up: 0, down: 0 };
    }
    
    // Options par défaut
    const {
      tableName = `${entityType}_votes`,
      entityIdField = `${entityType}_id`,
      voteField = "vote"
    } = options || {};
    
    // Obtenir les votes avec retry
    const response = await fetchWithRetry(async () => {
      const { data, error } = await supabase
        .from(tableName)
        .select(`${voteField}`)
        .eq(entityIdField, entityId);
      
      if (error) throw error;
      return data || [];
    }, 2);
    
    // Compter les votes
    const votes = response || [];
    const upVotes = votes.filter(item => item[voteField] === 'up').length;
    const downVotes = votes.filter(item => item[voteField] === 'down').length;
    
    return { up: upVotes, down: downVotes };
  } catch (err) {
    console.error('Erreur lors de la récupération des votes:', err);
    return { up: 0, down: 0 };
  }
};

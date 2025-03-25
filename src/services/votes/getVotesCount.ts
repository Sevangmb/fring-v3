
import { supabase } from "@/lib/supabase";
import { EntityType, VoteOptions, VotesCount } from "./types";
import { fetchWithRetry } from "@/services/network/retryUtils";
import { isValidEntityId, isOnline, getEntityTableInfo } from "./utils/voteUtils";

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
    
    // Get the appropriate table and field names
    const { tableName, idField } = getEntityTableInfo(entityType);
    const voteField = options?.voteField || "vote";
    
    // Build query
    const query = supabase
      .from(tableName)
      .select(`${voteField}`)
      .eq(idField, entityId);
    
    // Obtenir les votes avec retry
    const { data, error } = await fetchWithRetry(
      async () => await query,
      2
    );
    
    if (error) throw error;
    
    // Compter les votes
    const votes = data || [];
    const upVotes = votes.filter(item => item[voteField] === 'up').length;
    const downVotes = votes.filter(item => item[voteField] === 'down').length;
    
    return { up: upVotes, down: downVotes };
  } catch (err) {
    console.error('Erreur lors de la récupération des votes:', err);
    return { up: 0, down: 0 };
  }
};

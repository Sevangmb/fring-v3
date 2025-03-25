
import { supabase } from "@/lib/supabase";
import { VoteType, EntityType } from "./types";
import { fetchWithRetry } from "@/services/network/retryUtils";
import { isValidEntityId, getEntityTableInfo } from "./utils/voteUtils";

/**
 * Récupérer le vote de l'utilisateur pour une entité
 */
export const getUserVote = async (
  entityType: EntityType,
  entityId: number
): Promise<VoteType> => {
  if (!isValidEntityId(entityId)) return null;
  
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user?.id) return null;

    const { tableName, idField } = getEntityTableInfo(entityType);

    // Build query
    const query = supabase
      .from(tableName)
      .select('vote')
      .eq(idField, entityId)
      .eq('user_id', session.user.id);
      
    // Special handling for defi votes
    if (entityType === 'defi') {
      // For direct defi votes, we need to check where ensemble_id is null
      query.is('ensemble_id', null);
    }
    
    const { data, error } = await fetchWithRetry(
      async () => await query.maybeSingle(),
      3
    );

    if (error) throw error;
    return data ? data.vote : null;
  } catch (error) {
    console.error("Erreur lors de la récupération du vote:", error);
    return null;
  }
};

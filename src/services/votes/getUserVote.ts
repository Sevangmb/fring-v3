
import { supabase } from "@/lib/supabase";
import { VoteType, EntityType } from "./types";
import { fetchWithRetry } from "@/services/network/retryUtils";
import { isValidEntityId } from "./utils/voteUtils";

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

/**
 * Helper to get table info for each entity type
 */
function getEntityTableInfo(entityType: EntityType): { tableName: string; idField: string } {
  switch (entityType) {
    case 'vetement':
      return { tableName: 'vetement_votes', idField: 'vetement_id' };
    case 'ensemble':
      return { tableName: 'tenue_votes', idField: 'tenue_id' };
    case 'defi':
      return { tableName: 'defi_votes', idField: 'defi_id' };
    default:
      throw new Error(`Type d'entité non supporté: ${entityType}`);
  }
}

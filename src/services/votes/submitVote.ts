
import { supabase } from "@/lib/supabase";
import { VoteType, EntityType } from "./types";
import { fetchWithRetry } from "@/services/network/retryUtils";
import { isValidEntityId } from "./utils/voteUtils";

/**
 * Submit a vote for a specific entity
 */
export const submitVote = async (
  entityType: EntityType,
  entityId: number,
  vote: VoteType
): Promise<boolean> => {
  try {
    // Get current session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user?.id) {
      throw new Error("Vous devez être connecté pour voter");
    }

    // Get table and field names based on entity type
    const { tableName, idField } = getEntityTableInfo(entityType);

    // Check if user already voted
    const query = supabase
      .from(tableName)
      .select('id')
      .eq(idField, entityId)
      .eq('user_id', session.user.id);
      
    // Special handling for defi votes
    if (entityType === 'defi') {
      // For direct defi votes, we need to check where ensemble_id is null
      query.is('ensemble_id', null);
    }
    
    const { data: existingVote, error: fetchError } = await fetchWithRetry(
      async () => await query.maybeSingle(),
      3
    );

    if (fetchError) throw fetchError;

    if (existingVote) {
      // User already voted, just return true without updating
      console.log("L'utilisateur a déjà voté pour ce défi");
      return true;
    } else {
      // Insert new vote
      const voteData: Record<string, any> = {
        [idField]: entityId,
        user_id: session.user.id,
        vote
      };
      
      // Special handling for direct defi votes
      if (entityType === 'defi') {
        // For direct defi votes, we set ensemble_id to null explicitly
        voteData.ensemble_id = null;
      }
      
      const { error: insertError } = await fetchWithRetry(
        async () => await supabase.from(tableName).insert(voteData),
        3
      );

      if (insertError) throw insertError;
      return true;
    }
  } catch (error) {
    console.error("Erreur lors du vote:", error);
    throw error;
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

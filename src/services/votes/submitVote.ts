
import { supabase } from "@/lib/supabase";
import { VoteType, EntityType } from "./types";
import { fetchWithRetry } from "@/services/network/retryUtils";
import { isValidEntityId, getEntityTableInfo } from "./utils/voteUtils";

/**
 * Submit a vote for a specific entity
 */
export const submitVote = async (
  entityType: EntityType,
  entityId: number,
  vote: VoteType
): Promise<boolean> => {
  if (!isValidEntityId(entityId)) {
    console.error(`ID d'entité invalide: ${entityId}`);
    return false;
  }

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
      .select('id, vote')
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
      // Update existing vote
      const { error: updateError } = await fetchWithRetry(
        async () => await supabase
          .from(tableName)
          .update({ vote })
          .eq('id', existingVote.id),
        3
      );

      if (updateError) throw updateError;
      console.log(`Vote mis à jour: ${vote} pour ${entityType} ${entityId}`);
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
      console.log(`Nouveau vote: ${vote} pour ${entityType} ${entityId}`);
    }

    return true;
  } catch (error) {
    console.error("Erreur lors du vote:", error);
    throw error;
  }
};


import { supabase } from "@/lib/supabase";
import { VoteType, EntityType, VotesCount } from "./types";
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
    
    console.log(`Soumission du vote dans la table ${tableName}, champ ${idField}, valeur ${entityId}`);

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

    if (fetchError) {
      console.error("Erreur lors de la vérification du vote existant:", fetchError);
      throw fetchError;
    }

    console.log("Vote existant:", existingVote);

    if (existingVote) {
      // Update existing vote
      const { error: updateError } = await fetchWithRetry(
        async () => await supabase
          .from(tableName)
          .update({ vote })
          .eq('id', existingVote.id),
        3
      );

      if (updateError) {
        console.error("Erreur lors de la mise à jour du vote:", updateError);
        throw updateError;
      }
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
      
      console.log("Tentative d'insertion de vote avec données:", voteData);
      
      const { error: insertError } = await fetchWithRetry(
        async () => await supabase.from(tableName).insert(voteData),
        3
      );

      if (insertError) {
        console.error("Erreur lors de l'insertion du vote:", insertError);
        throw insertError;
      }
      console.log(`Nouveau vote: ${vote} pour ${entityType} ${entityId}`);
    }

    return true;
  } catch (error) {
    console.error("Erreur lors du vote:", error);
    throw error;
  }
};

/**
 * Get the current user's vote for an entity
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
    
    const { data, error } = await query.maybeSingle();

    if (error) {
      console.error("Erreur lors de la récupération du vote utilisateur:", error);
      throw error;
    }
    return data ? data.vote : null;
  } catch (error) {
    console.error("Erreur lors de la récupération du vote:", error);
    return null;
  }
};

/**
 * Get all votes for an entity
 */
export const getVotesCount = async (
  entityType: EntityType,
  entityId: number
): Promise<VotesCount> => {
  if (!isValidEntityId(entityId)) return { up: 0, down: 0 };
  
  try {
    const { tableName, idField } = getEntityTableInfo(entityType);

    // Build query
    const query = supabase
      .from(tableName)
      .select('vote')
      .eq(idField, entityId);
      
    // Special handling for defi votes
    if (entityType === 'defi') {
      // For direct defi votes, we need to count where ensemble_id is null
      query.is('ensemble_id', null);
    }
    
    const { data, error } = await query;

    if (error) {
      console.error("Erreur lors de la récupération des votes:", error);
      throw error;
    }

    const votes = data || [];
    return {
      up: votes.filter(v => v.vote === 'up').length,
      down: votes.filter(v => v.vote === 'down').length
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des votes:", error);
    return { up: 0, down: 0 };
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
      return { tableName: 'ensemble_votes', idField: 'ensemble_id' };
    case 'defi':
      return { tableName: 'defi_votes', idField: 'defi_id' };
    default:
      throw new Error(`Type d'entité non supporté: ${entityType}`);
  }
}

export { calculateScore } from "./types";

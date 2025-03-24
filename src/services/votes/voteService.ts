
import { supabase } from "@/lib/supabase";
import { VoteType, EntityType, VotesCount } from "./types";
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
    const { data: existingVote, error: fetchError } = await supabase
      .from(tableName)
      .select('id')
      .eq(idField, entityId)
      .eq('user_id', session.user.id)
      .maybeSingle();

    if (fetchError) throw fetchError;

    if (existingVote) {
      // Update existing vote
      const { error: updateError } = await supabase
        .from(tableName)
        .update({ vote })
        .eq('id', existingVote.id);

      if (updateError) throw updateError;
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
      
      const { error: insertError } = await supabase
        .from(tableName)
        .insert(voteData);

      if (insertError) throw insertError;
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

    if (error) throw error;
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

    if (error) throw error;

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
      return { tableName: 'tenue_votes', idField: 'tenue_id' };
    case 'defi':
      return { tableName: 'defi_votes', idField: 'defi_id' };
    default:
      throw new Error(`Type d'entité non supporté: ${entityType}`);
  }
}

export { calculateScore } from "./types";

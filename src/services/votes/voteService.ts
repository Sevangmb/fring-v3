
import { supabase } from "@/lib/supabase";
import { VoteType, EntityType, VotesCount } from "./types";

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

    // Get table info based on entity type
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
      const { error: insertError } = await supabase
        .from(tableName)
        .insert({
          [idField]: entityId,
          user_id: session.user.id,
          vote
        });

      if (insertError) throw insertError;
    }

    return true;
  } catch (error) {
    console.error("Erreur lors du vote:", error);
    return false;
  }
};

/**
 * Get the current user's vote for an entity
 */
export const getUserVote = async (
  entityType: EntityType,
  entityId: number
): Promise<VoteType> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user?.id) return null;

    const { tableName, idField } = getEntityTableInfo(entityType);

    const { data, error } = await supabase
      .from(tableName)
      .select('vote')
      .eq(idField, entityId)
      .eq('user_id', session.user.id)
      .maybeSingle();

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
  try {
    const { tableName, idField } = getEntityTableInfo(entityType);

    const { data, error } = await supabase
      .from(tableName)
      .select('vote')
      .eq(idField, entityId);

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
 * Calculate score from votes (upvotes - downvotes)
 */
export const calculateScore = (votes: VotesCount): number => {
  return votes.up - votes.down;
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

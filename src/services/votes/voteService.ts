
import { supabase } from "@/lib/supabase";
import { VoteType, EntityType, VoteOptions, VotesCount } from "./types";
import { fetchWithRetry } from "../network/retryUtils";

/**
 * Submit a vote for an entity
 */
export const submitVote = async (
  entityType: EntityType,
  entityId: number,
  vote: VoteType,
  options?: VoteOptions,
  extraFields?: Record<string, any>
): Promise<boolean> => {
  try {
    if (!navigator.onLine) {
      throw new Error('Pas de connexion internet');
    }
    
    // Default options
    const {
      tableName = `${entityType}_votes`,
      userIdField = "user_id",
      entityIdField = `${entityType}_id`,
      voteField = "vote"
    } = options || {};
    
    // Get current user session
    const sessionResponse = await fetchWithRetry(
      async () => {
        const response = await supabase.auth.getSession();
        return response;
      },
      3
    );
    
    const userId = sessionResponse?.data?.session?.user?.id;
    
    if (!userId) {
      throw new Error('Vous devez être connecté pour voter');
    }

    // Check if user already voted
    const existingVoteResponse = await fetchWithRetry(
      async () => {
        return await supabase
          .from(tableName)
          .select("id")
          .eq(entityIdField, entityId)
          .eq(userIdField, userId)
          .maybeSingle();
      },
      3
    );
    
    if (existingVoteResponse.error) throw existingVoteResponse.error;
    const existingVote = existingVoteResponse.data;

    // Prepare vote data
    const voteData = {
      [entityIdField]: entityId,
      [userIdField]: userId,
      [voteField]: vote,
      ...extraFields
    };

    if (existingVote) {
      // Update existing vote
      const updateResponse = await fetchWithRetry(
        async () => {
          return await supabase
            .from(tableName)
            .update({ [voteField]: vote })
            .eq("id", existingVote.id);
        },
        3
      );
      
      if (updateResponse.error) throw updateResponse.error;
    } else {
      // Create new vote
      const insertResponse = await fetchWithRetry(
        async () => {
          return await supabase
            .from(tableName)
            .insert(voteData);
        },
        3
      );
      
      if (insertResponse.error) throw insertResponse.error;
    }
    
    return true;
  } catch (err: any) {
    console.error("Error submitting vote:", err);
    return false;
  }
};

/**
 * Get the user's vote for an entity
 */
export const getUserVote = async (
  entityType: EntityType,
  entityId: number,
  options?: VoteOptions
): Promise<VoteType> => {
  try {
    if (!navigator.onLine) {
      console.warn('No internet connection, unable to retrieve vote');
      return null;
    }
    
    // Default options
    const {
      tableName = `${entityType}_votes`,
      userIdField = "user_id",
      entityIdField = `${entityType}_id`,
      voteField = "vote"
    } = options || {};
    
    // Get current user session
    const sessionResponse = await fetchWithRetry(
      async () => {
        return await supabase.auth.getSession();
      },
      3
    );
    
    const userId = sessionResponse?.data?.session?.user?.id;
    
    if (!userId) return null;
    
    // Get user vote
    const voteResponse = await fetchWithRetry(
      async () => {
        return await supabase
          .from(tableName)
          .select(voteField)
          .eq(entityIdField, entityId)
          .eq(userIdField, userId)
          .maybeSingle();
      },
      3
    );
    
    if (voteResponse.error) {
      console.error('Error retrieving vote:', voteResponse.error);
      return null;
    }
    
    return voteResponse.data ? voteResponse.data[voteField] : null;
  } catch (err) {
    console.error('Error retrieving vote:', err);
    return null;
  }
};

/**
 * Get all votes for an entity
 */
export const getVotesCount = async (
  entityType: EntityType,
  entityId: number,
  options?: VoteOptions
): Promise<VotesCount> => {
  try {
    if (!navigator.onLine) {
      console.warn('No internet connection, unable to retrieve votes');
      return { up: 0, down: 0 };
    }
    
    // Default options
    const {
      tableName = `${entityType}_votes`,
      entityIdField = `${entityType}_id`,
      voteField = "vote"
    } = options || {};
    
    // Get votes
    const votesResponse = await fetchWithRetry(
      async () => {
        return await supabase
          .from(tableName)
          .select(`${voteField}`)
          .eq(entityIdField, entityId);
      },
      3
    );
    
    if (votesResponse.error) {
      console.error('Error retrieving votes:', votesResponse.error);
      return { up: 0, down: 0 };
    }
    
    // Count votes
    const votes = votesResponse.data || [];
    const upVotes = votes.filter(item => item[voteField] === 'up').length;
    const downVotes = votes.filter(item => item[voteField] === 'down').length;
    
    return { up: upVotes, down: downVotes };
  } catch (err) {
    console.error('Error retrieving votes:', err);
    return { up: 0, down: 0 };
  }
};

/**
 * Calculate score (up votes - down votes)
 */
export const calculateScore = (votes: VotesCount): number => {
  return votes.up - votes.down;
};

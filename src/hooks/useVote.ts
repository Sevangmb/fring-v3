
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

export type VoteType = 'up' | 'down' | null;

export type EntityType = 'vetement' | 'ensemble' | 'defi';

interface VoteOptions {
  tableName: string; // The table where votes are stored
  userIdField?: string; // Field that references the user ID (default: "user_id")
  entityIdField?: string; // Field that references the entity ID (default: entity type + "_id")
  voteField?: string; // Field that stores the vote value (default: "vote")
}

/**
 * Hook for handling votes on different entity types
 */
export const useVote = (
  entityType: EntityType,
  options?: VoteOptions
) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Default options
  const {
    tableName = `${entityType}_votes`,
    userIdField = "user_id",
    entityIdField = `${entityType}_id`,
    voteField = "vote"
  } = options || {};
  
  /**
   * Submit a vote for an entity
   */
  const submitVote = async (
    entityId: number,
    vote: VoteType,
    extraFields?: Record<string, any>
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Get current user session
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      
      if (!userId) {
        throw new Error('Vous devez être connecté pour voter');
      }

      // Check if user already voted
      const { data: existingVote, error: fetchError } = await supabase
        .from(tableName)
        .select("id")
        .eq(entityIdField, entityId)
        .eq(userIdField, userId)
        .maybeSingle();
      
      if (fetchError) throw fetchError;

      // Prepare vote data
      const voteData = {
        [entityIdField]: entityId,
        [userIdField]: userId,
        [voteField]: vote,
        ...extraFields
      };

      if (existingVote) {
        // Update existing vote
        const { error: updateError } = await supabase
          .from(tableName)
          .update({ [voteField]: vote })
          .eq("id", existingVote.id);
        
        if (updateError) throw updateError;
      } else {
        // Create new vote
        const { error: insertError } = await supabase
          .from(tableName)
          .insert(voteData);
        
        if (insertError) throw insertError;
      }
      
      toast({
        title: "Vote enregistré !",
        description: `Vous avez ${vote === 'up' ? 'aimé' : 'disliké'} cet élément.`,
        variant: vote === 'up' ? "default" : "destructive",
      });
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du vote';
      setError(err instanceof Error ? err : new Error(errorMessage));
      
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      });
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Get the user's vote for an entity
   */
  const getUserVote = async (entityId: number): Promise<VoteType> => {
    try {
      // Get current user session
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      
      if (!userId) return null;
      
      const { data, error } = await supabase
        .from(tableName)
        .select(voteField)
        .eq(entityIdField, entityId)
        .eq(userIdField, userId)
        .maybeSingle();
      
      if (error) throw error;
      
      return data ? data[voteField] : null;
    } catch (err) {
      console.error('Erreur lors de la récupération du vote:', err);
      return null;
    }
  };

  /**
   * Get all votes for an entity
   */
  const getVotesCount = async (entityId: number): Promise<{ up: number; down: number }> => {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select(`${voteField}`)
        .eq(entityIdField, entityId);
      
      if (error) throw error;
      
      // Count votes
      const upVotes = data.filter(item => item[voteField] === 'up').length;
      const downVotes = data.filter(item => item[voteField] === 'down').length;
      
      return { up: upVotes, down: downVotes };
    } catch (err) {
      console.error('Erreur lors de la récupération des votes:', err);
      return { up: 0, down: 0 };
    }
  };

  /**
   * Calculate score (up votes - down votes)
   */
  const calculateScore = (votes: { up: number; down: number }): number => {
    return votes.up - votes.down;
  };

  return {
    submitVote,
    getUserVote,
    getVotesCount,
    calculateScore,
    isLoading,
    error
  };
};


import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  VoteType, 
  EntityType, 
  VoteOptions 
} from "@/services/votes/types";
import { 
  submitVote as submitVoteApi,
  getUserVote as getUserVoteApi,
  getVotesCount as getVotesCountApi,
  calculateScore as calculateScoreApi
} from "@/services/votes/voteService";

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
      const success = await submitVoteApi(entityType, entityId, vote, options, extraFields);
      
      if (success) {
        toast({
          title: "Vote enregistré !",
          description: `Vous avez ${vote === 'up' ? 'aimé' : 'disliké'} cet élément.`,
          variant: vote === 'up' ? "default" : "destructive",
        });
      } else {
        throw new Error('Erreur lors du vote');
      }
      
      return success;
    } catch (err: any) {
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
    return await getUserVoteApi(entityType, entityId, options);
  };

  /**
   * Get all votes for an entity
   */
  const getVotesCount = async (entityId: number) => {
    return await getVotesCountApi(entityType, entityId, options);
  };

  /**
   * Calculate score (up votes - down votes)
   */
  const calculateScore = calculateScoreApi;

  return {
    submitVote,
    getUserVote,
    getVotesCount,
    calculateScore,
    isLoading,
    error
  };
};

// Re-export types from the types file for convenience
export type { VoteType, EntityType } from "@/services/votes/types";

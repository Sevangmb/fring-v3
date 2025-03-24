
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { VoteType, EntityType, VotesCount, calculateScore } from "@/services/votes/types";
import { 
  submitVote as submitVoteApi,
  getUserVote as getUserVoteApi,
  getVotesCount as getVotesCountApi
} from "@/services/votes/voteService";

interface UseVoteOptions {
  onVoteSuccess?: (vote: VoteType) => void;
  onVoteError?: (error: Error) => void;
}

/**
 * Simple hook for managing votes on different entity types
 */
export const useVote = (
  entityType: EntityType,
  entityId?: number,
  options?: UseVoteOptions
) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [userVote, setUserVote] = useState<VoteType>(null);
  const [votesCount, setVotesCount] = useState<VotesCount>({ up: 0, down: 0 });
  const [error, setError] = useState<Error | null>(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // Monitor online status
  useState(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  });

  /**
   * Load current vote data
   */
  const loadVoteData = useCallback(async () => {
    if (!entityId) return;
    
    try {
      // Get user's current vote
      const vote = await getUserVoteApi(entityType, entityId);
      setUserVote(vote);
      
      // Get all votes
      const votes = await getVotesCountApi(entityType, entityId);
      setVotesCount(votes);
    } catch (err) {
      console.error("Erreur lors du chargement des votes:", err);
    }
  }, [entityType, entityId]);

  /**
   * Submit a vote for an entity
   */
  const submitVote = useCallback(async (vote: VoteType): Promise<boolean> => {
    if (!entityId) {
      toast({
        title: "Erreur",
        description: "ID de l'élément manquant.",
        variant: "destructive",
      });
      return false;
    }
    
    if (isOffline) {
      toast({
        title: "Pas de connexion",
        description: "Vérifiez votre connexion internet et réessayez.",
        variant: "destructive",
      });
      return false;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Save vote optimistically
      setUserVote(vote);
      
      // Update local vote count optimistically
      const newVotesCount = { ...votesCount };
      
      // If changing existing vote
      if (userVote) {
        if (userVote === 'up') newVotesCount.up = Math.max(0, newVotesCount.up - 1);
        if (userVote === 'down') newVotesCount.down = Math.max(0, newVotesCount.down - 1);
      }
      
      // Add new vote
      if (vote === 'up') newVotesCount.up++;
      if (vote === 'down') newVotesCount.down++;
      
      setVotesCount(newVotesCount);
      
      // Send to API
      const success = await submitVoteApi(entityType, entityId, vote);
      
      if (success) {
        toast({
          title: "Vote enregistré !",
          description: `Vous avez ${vote === 'up' ? 'aimé' : 'disliké'} cet élément.`,
          variant: vote === 'up' ? "default" : "destructive",
        });
        
        // Call success callback if provided
        if (options?.onVoteSuccess) {
          options.onVoteSuccess(vote);
        }
      } else {
        throw new Error('Erreur lors du vote');
      }
      
      return success;
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du vote';
      const errorObj = err instanceof Error ? err : new Error(errorMessage);
      
      setError(errorObj);
      
      // Revert optimistic updates on error
      loadVoteData();
      
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      });
      
      // Call error callback if provided
      if (options?.onVoteError) {
        options.onVoteError(errorObj);
      }
      
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [entityType, entityId, userVote, votesCount, isOffline, toast, loadVoteData, options]);

  // Calculate score
  const score = calculateScore(votesCount);

  return {
    submitVote,
    userVote,
    votesCount,
    score,
    isLoading,
    isOffline,
    error,
    loadVoteData
  };
};

export { calculateScore };
export type { VoteType, EntityType, VotesCount };

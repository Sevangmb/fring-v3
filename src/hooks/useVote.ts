
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { VoteType, EntityType } from "@/services/votes/types";
import { submitVote, getUserVote, getVotesCount } from "@/services/votes/voteService";

interface UseVoteOptions {
  onVoteSuccess?: (vote: VoteType) => void;
  onVoteError?: (error: Error) => void;
}

export function useVote(
  entityType: EntityType,
  entityId: number,
  options?: UseVoteOptions
) {
  const [userVote, setUserVote] = useState<VoteType>(null);
  const [votesCount, setVotesCount] = useState<{ up: number; down: number }>({ up: 0, down: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const { toast } = useToast();

  useEffect(() => {
    const handleOnlineStatus = () => {
      setIsOffline(!navigator.onLine);
    };

    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  const loadVoteData = useCallback(async () => {
    if (!entityId || isOffline) return;

    try {
      // Assurer la compatibilité: convertir 'tenue' en 'ensemble' si nécessaire
      const apiEntityType = entityType === 'tenue' ? 'ensemble' : entityType;
      
      const [voteData, countsData] = await Promise.all([
        getUserVote(apiEntityType, entityId),
        getVotesCount(apiEntityType, entityId)
      ]);

      setUserVote(voteData);
      setVotesCount(countsData);
    } catch (error) {
      console.error('Erreur lors du chargement des votes:', error);
    }
  }, [entityType, entityId, isOffline]);

  useEffect(() => {
    loadVoteData();
  }, [loadVoteData]);

  const handleSubmitVote = useCallback(async (vote: VoteType) => {
    if (isOffline) {
      toast({
        title: 'Erreur de connexion',
        description: 'Vous êtes hors ligne. Veuillez vérifier votre connexion internet.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      // Assurer la compatibilité: convertir 'tenue' en 'ensemble' si nécessaire
      const apiEntityType = entityType === 'tenue' ? 'ensemble' : entityType;
      
      await submitVote(apiEntityType, entityId, vote);
      
      setUserVote(vote);
      
      setVotesCount(prev => {
        const newCounts = { ...prev };
        
        if (userVote) {
          if (userVote === 'up') newCounts.up = Math.max(0, newCounts.up - 1);
          if (userVote === 'down') newCounts.down = Math.max(0, newCounts.down - 1);
        }
        
        if (vote === 'up') newCounts.up += 1;
        if (vote === 'down') newCounts.down += 1;
        
        return newCounts;
      });
      
      if (options?.onVoteSuccess) {
        options.onVoteSuccess(vote);
      }
    } catch (error) {
      console.error('Erreur lors du vote:', error);
      
      toast({
        title: 'Erreur',
        description: error instanceof Error 
          ? error.message 
          : 'Une erreur est survenue lors du vote',
        variant: 'destructive',
      });
      
      if (options?.onVoteError && error instanceof Error) {
        options.onVoteError(error);
      }
    } finally {
      setIsLoading(false);
    }
  }, [entityType, entityId, userVote, isOffline, options, toast]);

  return {
    userVote,
    votesCount,
    isLoading,
    isOffline,
    submitVote: handleSubmitVote,
    loadVoteData
  };
}


import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { VoteType, EntityType } from "@/services/votes/types";
import { useVote } from "./useVote";

interface UseEntityVoteProps {
  entityType: EntityType;
  entityId?: number;
  onVoteSubmitted?: (vote: VoteType) => void;
}

export const useEntityVote = ({ 
  entityType, 
  entityId,
  onVoteSubmitted 
}: UseEntityVoteProps) => {
  const { toast } = useToast();
  const { 
    submitVote, 
    loadVoteData,
    userVote,
    votesCount, // Utiliser votesCount au lieu de votes pour correspondre à ce que useVote retourne
    score,
    isLoading: voteLoading,
    isOffline
  } = useVote(entityType, entityId);
  
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  
  // Load vote data initially
  useEffect(() => {
    if (entityId) {
      setLoading(true);
      loadVoteData().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
    
    // Update connection status
    setConnectionError(isOffline);
    
    const handleOnlineStatus = () => {
      setConnectionError(!navigator.onLine);
      if (navigator.onLine && entityId) {
        loadVoteData();
      }
    };
    
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    
    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, [entityId, loadVoteData, isOffline]);
  
  // Handle vote submission
  const handleVote = useCallback(async (vote: VoteType): Promise<boolean> => {
    if (isSubmitting || loading) return false;
    
    if (!navigator.onLine || connectionError) {
      toast({
        title: "Problème de connexion",
        description: "Vérifiez votre connexion internet et réessayez.",
        variant: "destructive"
      });
      return false;
    }
    
    setIsSubmitting(true);
    
    try {
      const success = await submitVote(vote);
      
      if (success && onVoteSubmitted) {
        onVoteSubmitted(vote);
      }
      
      return success;
    } catch (error) {
      console.error("Erreur lors du vote:", error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, loading, connectionError, submitVote, onVoteSubmitted, toast]);
  
  return {
    userVote,
    votes: votesCount, // Renvoyer votesCount en tant que votes pour maintenir la compatibilité ascendante
    score,
    loading: loading || voteLoading,
    isSubmitting,
    connectionError: connectionError || isOffline,
    handleVote,
    refresh: loadVoteData
  };
};

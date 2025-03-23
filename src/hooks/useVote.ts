
import { useState, useCallback } from "react";
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
 * Hook pour gérer les votes sur différents types d'entités
 */
export const useVote = (
  entityType: EntityType,
  options?: VoteOptions
) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
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
   * Soumettre un vote pour une entité
   */
  const submitVote = useCallback(async (
    entityId: number,
    vote: VoteType,
    extraFields?: Record<string, any>
  ): Promise<boolean> => {
    // Validate entityId
    if (entityId === undefined || entityId === null || isNaN(entityId)) {
      console.error(`Tentative de vote avec ID invalide: ${entityId}`);
      toast({
        title: "Erreur",
        description: "ID de l'élément manquant ou invalide.",
        variant: "destructive",
      });
      return false;
    }
    
    // Check network connection first
    if (!navigator.onLine) {
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
      console.log(`Soumission du vote: type=${entityType}, id=${entityId}, vote=${vote}`);
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
  }, [entityType, options, toast]);

  /**
   * Obtenir le vote de l'utilisateur pour une entité
   */
  const getUserVote = useCallback(async (entityId: number): Promise<VoteType> => {
    if (!navigator.onLine) return null;
    
    try {
      return await getUserVoteApi(entityType, entityId, options);
    } catch (error) {
      console.error("Erreur lors de la récupération du vote:", error);
      return null;
    }
  }, [entityType, options]);

  /**
   * Obtenir tous les votes pour une entité
   */
  const getVotesCount = useCallback(async (entityId: number) => {
    if (!navigator.onLine) return { up: 0, down: 0 };
    
    try {
      return await getVotesCountApi(entityType, entityId, options);
    } catch (error) {
      console.error("Erreur lors de la récupération des votes:", error);
      return { up: 0, down: 0 };
    }
  }, [entityType, options]);

  /**
   * Calculer le score (votes positifs - votes négatifs)
   */
  const calculateScore = calculateScoreApi;

  return {
    submitVote,
    getUserVote,
    getVotesCount,
    calculateScore,
    isLoading,
    isOffline,
    error
  };
};

// Réexporter les types depuis le fichier de types pour commodité
export type { VoteType, EntityType } from "@/services/votes/types";

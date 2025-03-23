
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
 * Hook pour gérer les votes sur différents types d'entités
 */
export const useVote = (
  entityType: EntityType,
  options?: VoteOptions
) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Soumettre un vote pour une entité
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
   * Obtenir le vote de l'utilisateur pour une entité
   */
  const getUserVote = async (entityId: number): Promise<VoteType> => {
    return await getUserVoteApi(entityType, entityId, options);
  };

  /**
   * Obtenir tous les votes pour une entité
   */
  const getVotesCount = async (entityId: number) => {
    return await getVotesCountApi(entityType, entityId, options);
  };

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
    error
  };
};

// Réexporter les types depuis le fichier de types pour commodité
export type { VoteType, EntityType } from "@/services/votes/types";

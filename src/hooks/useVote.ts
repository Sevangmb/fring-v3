
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

// Fonction utilitaire pour les retries de requêtes avec backoff exponentiel
const fetchWithRetry = async (
  fetchFn: () => Promise<any>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<any> => {
  let lastError;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      // Vérifier la connectivité d'abord
      if (!navigator.onLine) {
        throw new Error('Pas de connexion internet');
      }
      
      return await fetchFn();
    } catch (error) {
      console.log(`Tentative ${attempt + 1}/${maxRetries} échouée:`, error);
      lastError = error;
      
      if (attempt < maxRetries - 1) {
        // Attendre avant de réessayer avec un délai exponentiel
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt)));
      }
    }
  }
  
  throw lastError;
};

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
      if (!navigator.onLine) {
        throw new Error('Pas de connexion internet');
      }
      
      // Get current user session with improved error handling
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

      // Check if user already voted with improved error handling
      const existingVoteResponse = await fetchWithRetry(
        async () => {
          const response = await supabase
            .from(tableName)
            .select("id")
            .eq(entityIdField, entityId)
            .eq(userIdField, userId)
            .maybeSingle();
          return response;
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
        // Update existing vote with improved error handling
        const updateResponse = await fetchWithRetry(
          async () => {
            const response = await supabase
              .from(tableName)
              .update({ [voteField]: vote })
              .eq("id", existingVote.id);
            return response;
          },
          3
        );
        
        if (updateResponse.error) throw updateResponse.error;
      } else {
        // Create new vote with improved error handling
        const insertResponse = await fetchWithRetry(
          async () => {
            const response = await supabase
              .from(tableName)
              .insert(voteData);
            return response;
          },
          3
        );
        
        if (insertResponse.error) throw insertResponse.error;
      }
      
      toast({
        title: "Vote enregistré !",
        description: `Vous avez ${vote === 'up' ? 'aimé' : 'disliké'} cet élément.`,
        variant: vote === 'up' ? "default" : "destructive",
      });
      
      return true;
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
    try {
      if (!navigator.onLine) {
        console.warn('Pas de connexion internet, impossible de récupérer le vote');
        return null;
      }
      
      // Get current user session with improved error handling
      const sessionResponse = await fetchWithRetry(
        async () => {
          const response = await supabase.auth.getSession();
          return response;
        },
        3
      );
      
      const userId = sessionResponse?.data?.session?.user?.id;
      
      if (!userId) return null;
      
      // Get user vote with improved error handling
      const voteResponse = await fetchWithRetry(
        async () => {
          const response = await supabase
            .from(tableName)
            .select(voteField)
            .eq(entityIdField, entityId)
            .eq(userIdField, userId)
            .maybeSingle();
          return response;
        },
        3
      );
      
      if (voteResponse.error) {
        console.error('Erreur lors de la récupération du vote:', voteResponse.error);
        return null;
      }
      
      return voteResponse.data ? voteResponse.data[voteField] : null;
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
      if (!navigator.onLine) {
        console.warn('Pas de connexion internet, impossible de récupérer les votes');
        return { up: 0, down: 0 };
      }
      
      // Get votes with improved error handling
      const votesResponse = await fetchWithRetry(
        async () => {
          const response = await supabase
            .from(tableName)
            .select(`${voteField}`)
            .eq(entityIdField, entityId);
          return response;
        },
        3
      );
      
      if (votesResponse.error) {
        console.error('Erreur lors de la récupération des votes:', votesResponse.error);
        return { up: 0, down: 0 };
      }
      
      // Count votes
      const votes = votesResponse.data || [];
      const upVotes = votes.filter(item => item[voteField] === 'up').length;
      const downVotes = votes.filter(item => item[voteField] === 'down').length;
      
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


import { useState, useEffect, useCallback } from "react";
import { submitVote, getUserVote, getVotesCount } from "@/services/votes/voteService";
import { useToast } from "@/hooks/use-toast";
import { VoteType, EntityType } from "@/services/votes/types";

interface UseVoteOptions {
  onVoteSuccess?: () => void;
  onVoteError?: (error: any) => void;
}

export const useVote = (
  entityType: EntityType,
  entityId: number,
  options?: UseVoteOptions
) => {
  const { toast } = useToast();
  const [userVote, setUserVote] = useState<VoteType>(null);
  const [votesCount, setVotesCount] = useState({ up: 0, down: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // Vérifier l'état de la connexion
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Charger les données de vote
  const loadVoteData = useCallback(async () => {
    if (!entityId || isOffline) return;

    try {
      const [vote, counts] = await Promise.all([
        getUserVote(entityType, entityId),
        getVotesCount(entityType, entityId)
      ]);

      setUserVote(vote);
      setVotesCount(counts);
    } catch (error) {
      console.error("Erreur lors du chargement des votes:", error);
    }
  }, [entityType, entityId, isOffline]);

  // Charger les données au montage du composant
  useEffect(() => {
    loadVoteData();
  }, [loadVoteData]);

  // Soumettre un vote
  const submitUserVote = async (vote: VoteType) => {
    if (isOffline) {
      toast({
        title: "Vous êtes hors ligne",
        description: "Impossible de voter sans connexion internet",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      await submitVote(entityType, entityId, vote);
      
      // Mettre à jour l'état local
      setUserVote(vote);
      
      // Mettre à jour le compteur de votes
      const newCounts = { ...votesCount };
      
      // Si l'utilisateur avait déjà voté, décrémenter l'ancien vote
      if (userVote === 'up') newCounts.up--;
      if (userVote === 'down') newCounts.down--;
      
      // Incrémenter le nouveau vote
      if (vote === 'up') newCounts.up++;
      if (vote === 'down') newCounts.down++;
      
      setVotesCount(newCounts);

      // Notifier le succès
      toast({
        title: "Vote enregistré",
        description: vote === 'up' ? "Vous avez aimé" : "Vous n'avez pas aimé",
        variant: vote === 'up' ? "default" : "destructive"
      });

      // Callback success optionnel
      if (options?.onVoteSuccess) {
        options.onVoteSuccess();
      }
    } catch (error) {
      console.error("Erreur lors du vote:", error);
      
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer votre vote",
        variant: "destructive"
      });
      
      // Callback error optionnel
      if (options?.onVoteError) {
        options.onVoteError(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    userVote,
    votesCount,
    isLoading,
    isOffline,
    submitVote: submitUserVote,
    loadVoteData
  };
};

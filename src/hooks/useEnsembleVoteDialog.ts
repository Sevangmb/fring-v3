
import { useState, useCallback, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { VoteType } from "@/services/votes/types";

export function useEnsembleVoteDialog(
  elementId: number,
  elementType: "ensemble" | "defi",
  onVoteSubmitted?: (vote: VoteType) => void
) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userVote, setUserVote] = useState<VoteType>(null);
  const [voteCounts, setVoteCounts] = useState({ up: 0, down: 0 });
  const { toast } = useToast();

  // Fonction pour récupérer le vote actuel de l'utilisateur
  const fetchUserVote = useCallback(async () => {
    if (!elementId) return;
    
    try {
      const { getUserVote } = await import('@/services/votes/getUserVote');
      const vote = await getUserVote(elementType, elementId);
      setUserVote(vote);
    } catch (error) {
      console.error('Erreur lors de la récupération du vote:', error);
    }
  }, [elementId, elementType]);

  // Fonction pour récupérer le nombre de votes
  const fetchVoteCounts = useCallback(async () => {
    if (!elementId) return;
    
    try {
      const { getVotesCount } = await import('@/services/votes/getVotesCount');
      const counts = await getVotesCount(elementType, elementId);
      setVoteCounts(counts);
    } catch (error) {
      console.error('Erreur lors de la récupération des votes:', error);
    }
  }, [elementId, elementType]);

  // Chargement initial des données
  useEffect(() => {
    if (isOpen) {
      Promise.all([fetchUserVote(), fetchVoteCounts()]);
    }
  }, [isOpen, fetchUserVote, fetchVoteCounts]);

  // Fonction pour soumettre un vote
  const handleSubmitVote = useCallback(async (vote: VoteType) => {
    if (!elementId) return;
    
    setIsLoading(true);
    try {
      const { submitVote } = await import('@/services/votes/submitVote');
      
      // Mise à jour optimiste de l'UI
      const previousVote = userVote;
      setUserVote(vote);
      
      // Mise à jour optimiste du compteur
      setVoteCounts(prev => {
        const newCounts = { ...prev };
        
        // Si l'utilisateur avait déjà voté, retirer ce vote
        if (previousVote === 'up') newCounts.up--;
        else if (previousVote === 'down') newCounts.down--;
        
        // Ajouter le nouveau vote
        if (vote === 'up') newCounts.up++;
        else if (vote === 'down') newCounts.down++;
        
        return newCounts;
      });
      
      // Appel à l'API
      const success = await submitVote(elementType, elementId, vote);
      
      if (success) {
        toast({
          title: "Vote enregistré",
          description: vote === 'up' 
            ? "Vous avez aimé cet élément" 
            : "Vous n'avez pas aimé cet élément",
          variant: vote === 'up' ? "default" : "destructive"
        });
        
        // Rafraîchir les données
        fetchVoteCounts();
        
        // Appeler le callback si fourni
        if (onVoteSubmitted) {
          onVoteSubmitted(vote);
        }
      } else {
        // Restaurer l'état précédent en cas d'échec
        setUserVote(previousVote);
        fetchVoteCounts();
        
        toast({
          title: "Erreur",
          description: "Impossible d'enregistrer votre vote",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Erreur lors du vote:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du vote",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [elementId, elementType, userVote, toast, fetchVoteCounts, onVoteSubmitted]);

  return {
    isOpen,
    setIsOpen,
    isLoading,
    userVote,
    voteCounts,
    submitVote: handleSubmitVote,
    refreshData: useCallback(() => {
      Promise.all([fetchUserVote(), fetchVoteCounts()]);
    }, [fetchUserVote, fetchVoteCounts])
  };
}

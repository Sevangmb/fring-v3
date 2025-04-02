
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { VoteType } from '@/services/votes/types';
import { submitVote } from '@/services/defi/votes/submitVote';

export const useDefiVoting = (fetchVotes: () => Promise<void>) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentEnsembleIndex, setCurrentEnsembleIndex] = useState(0);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const { toast } = useToast();

  const handleVote = useCallback(async (ensembleId: number, voteType: VoteType) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      // Submit vote to the API
      await submitVote('defi', ensembleId, voteType);

      // Update the votes data
      await fetchVotes();

      // Show success toast
      toast({
        title: "Vote enregistré",
        description: "Votre vote a été pris en compte avec succès.",
        variant: "default",
      });

      // Show success message and auto-advance
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
        setCurrentEnsembleIndex(prev => prev + 1);
      }, 1500);
    } catch (error) {
      console.error("Erreur lors du vote:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer votre vote. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, fetchVotes, toast]);

  return {
    isSubmitting,
    currentEnsembleIndex,
    setCurrentEnsembleIndex,
    showSuccessMessage,
    handleVote
  };
};

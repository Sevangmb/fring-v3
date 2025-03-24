
import { useDefiData } from "./useDefiData";
import { useCarouselNavigation } from "./useCarouselNavigation";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export const useVotingCarousel = (defiId: number) => {
  // Get defi data and participations
  const {
    defi,
    participations,
    votingState,
    loading,
    connectionError,
    setParticipations,
    setVotingState
  } = useDefiData(defiId);

  // Setup carousel navigation
  const {
    currentIndex,
    navigatePrevious,
    navigateNext
  } = useCarouselNavigation(participations.length);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Handle vote submission
  const handleVote = async (ensembleId: number, vote: 'up' | 'down') => {
    if (isSubmitting || connectionError) return;
    
    setIsSubmitting(true);
    
    try {
      // Load vote service dynamically to avoid circular dependencies
      const { submitVote } = await import("@/services/votes/voteService");
      
      // Update state optimistically
      const oldVote = votingState[ensembleId];
      setVotingState(prev => ({
        ...prev,
        [ensembleId]: vote
      }));
      
      // Update participations with new vote counts
      setParticipations(prev => 
        prev.map(p => {
          if (p.ensemble_id === ensembleId) {
            const votes = { ...p.votes };
            
            // If changing existing vote, remove old vote
            if (oldVote) {
              if (oldVote === 'up') votes.up = Math.max(0, votes.up - 1);
              if (oldVote === 'down') votes.down = Math.max(0, votes.down - 1);
            }
            
            // Add new vote
            if (vote === 'up') votes.up += 1;
            if (vote === 'down') votes.down += 1;
            
            // Recalculate score
            const score = votes.up - votes.down;
            
            return { ...p, votes, score };
          }
          return p;
        })
      );
      
      // Submit vote to server
      const success = await submitVote('defi', defiId, vote);
      
      if (success) {
        toast({
          title: "Vote enregistré !",
          description: `Vous avez ${vote === 'up' ? 'aimé' : 'disliké'} cet ensemble.`,
          variant: vote === 'up' ? "default" : "destructive",
        });
      } else {
        throw new Error("Échec du vote");
      }
    } catch (error) {
      console.error("Error voting:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer votre vote",
        variant: "destructive"
      });
      
      // Revert optimistic updates on error
      // This would require reloading the entire defi data
      // We could implement this if needed
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    defi,
    participations,
    currentIndex,
    loading,
    votingState,
    isSubmitting,
    connectionError,
    handleVote,
    navigatePrevious,
    navigateNext
  };
};

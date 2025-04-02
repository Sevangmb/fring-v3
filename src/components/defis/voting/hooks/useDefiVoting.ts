
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { submitVote } from "@/services/defi/voteService";
import { fetchWithRetry, checkConnection } from "../utils/networkUtils";
import { VoteType } from "@/services/votes/types";

export const useDefiVoting = ({
  defiId,
  participations,
  votingState,
  setParticipations,
  setVotingState
}: {
  defiId: number;
  participations: any[];
  votingState: Record<number, VoteType>;
  setParticipations: React.Dispatch<React.SetStateAction<any[]>>;
  setVotingState: React.Dispatch<React.SetStateAction<Record<number, VoteType>>>;
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleVote = async (ensembleId: number, vote: VoteType) => {
    // Prevent voting while already submitting
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      // First check connection
      const isConnected = await checkConnection();
      if (!isConnected) {
        toast({
          title: "Problème de connexion",
          description: "Impossible de se connecter au serveur. Vérifiez votre connexion internet.",
          variant: "destructive"
        });
        return;
      }
      
      const success = await fetchWithRetry(
        async () => await submitVote(defiId, ensembleId, vote),
        3
      );
      
      if (success) {
        // Update local state for votes
        setVotingState(prev => ({
          ...prev,
          [ensembleId]: vote
        }));
        
        // Update vote counts and scores
        setParticipations(prev => 
          prev.map(p => {
            if (p.ensemble_id === ensembleId) {
              const oldVote = votingState[ensembleId];
              const votes = { ...p.votes };
              
              // If user is changing their vote
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
        
        toast({
          title: "Vote enregistré !",
          description: `Vous avez ${vote === 'up' ? 'aimé' : 'disliké'} cet ensemble.`,
          variant: vote === 'up' ? "default" : "destructive",
        });
      }
    } catch (error) {
      console.error("Error during voting:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer votre vote",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleVote
  };
};

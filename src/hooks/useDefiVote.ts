
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { VoteType } from "@/services/votes/types";
import { 
  getDefiParticipationsWithVotes,
  getUserVote,
  submitVote,
  fetchDefiById
} from "@/services/defi/votes";
import { ParticipationWithVotes } from "@/services/defi/votes/types";
import { calculateScore } from "@/services/defi/votes/utils";

interface EnsembleVoteState {
  [ensembleId: number]: VoteType;
}

export const useDefiVote = (defiId: number) => {
  const { toast } = useToast();
  const [votingState, setVotingState] = useState<EnsembleVoteState>({});
  const [participations, setParticipations] = useState<ParticipationWithVotes[]>([]);
  const [defi, setDefi] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load participations and user votes
  const loadData = useCallback(async () => {
    if (!defiId || isNaN(defiId)) {
      setError(new Error("ID du défi invalide"));
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Fetch defi details
      const defiData = await fetchDefiById(defiId);
      setDefi(defiData);
      
      // Fetch participations with votes
      const participationsData = await getDefiParticipationsWithVotes(defiId);
      setParticipations(participationsData);
      
      // Get user votes for each participation
      const userVotes: EnsembleVoteState = {};
      
      for (const participation of participationsData) {
        const userVote = await getUserVote(defiId, participation.ensemble_id);
        userVotes[participation.ensemble_id] = userVote;
      }
      
      setVotingState(userVotes);
    } catch (err) {
      console.error("Erreur lors du chargement des données:", err);
      setError(err instanceof Error ? err : new Error('Erreur lors du chargement des données'));
      
      toast({
        title: "Erreur",
        description: "Impossible de charger les participations du défi",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [defiId, toast]);

  useEffect(() => {
    loadData();
    
    // Setup network status change listeners
    const handleOnlineStatusChange = () => {
      if (navigator.onLine) {
        loadData();
      }
    };
    
    window.addEventListener('online', handleOnlineStatusChange);
    
    return () => {
      window.removeEventListener('online', handleOnlineStatusChange);
    };
  }, [defiId, loadData]);

  // Submit vote with specific logic for defi participations
  const handleSubmitVote = useCallback(async (ensembleId: number, vote: VoteType): Promise<boolean> => {
    if (!navigator.onLine) {
      toast({
        title: "Pas de connexion",
        description: "Vérifiez votre connexion internet et réessayez.",
        variant: "destructive",
      });
      return false;
    }
    
    try {
      const success = await submitVote(defiId, ensembleId, vote);
      
      if (success) {
        // Update local state
        setVotingState(prev => ({
          ...prev,
          [ensembleId]: vote
        }));
        
        // Update participation scores
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
              const score = calculateScore(votes);
              
              return { ...p, votes, score };
            }
            return p;
          }).sort((a, b) => b.score - a.score) // Re-sort by score
        );
        
        toast({
          title: "Vote enregistré !",
          description: `Vous avez ${vote === 'up' ? 'aimé' : 'disliké'} cet ensemble.`,
          variant: vote === 'up' ? "default" : "destructive",
        });
      }
      
      return success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du vote';
      console.error("Erreur lors du vote:", errorMessage);
      
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      });
      
      return false;
    }
  }, [defiId, votingState, toast]);

  return {
    participations,
    votingState,
    defi,
    loading,
    error,
    submitVote: handleSubmitVote,
    refreshData: loadData
  };
};


import { useState, useCallback, useEffect } from "react";
import { useCarouselNavigation } from "./useCarouselNavigation";
import { submitVote, getUserVote, getVotesCount } from "@/services/votes/voteService";
import { useToast } from "@/hooks/use-toast";
import { VoteType } from "@/services/votes/types";

export const useVotingCarousel = (defiId: number) => {
  const { toast } = useToast();
  const [defi, setDefi] = useState<any>(null);
  const [participations, setParticipations] = useState<any[]>([]);
  const [votingState, setVotingState] = useState<Record<number, VoteType>>({});
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [connectionError, setConnectionError] = useState(false);

  // Setup carousel navigation
  const {
    currentIndex,
    navigatePrevious,
    navigateNext
  } = useCarouselNavigation(participations.length);

  // Load defi data and participations
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      // Check connection
      if (!navigator.onLine) {
        setConnectionError(true);
        setLoading(false);
        return;
      }

      // Load defi data
      const { supabase } = await import('@/lib/supabase');
      
      // Fetch defi details
      const { data: defiData, error: defiError } = await supabase
        .from('defis')
        .select('*')
        .eq('id', defiId)
        .single();
      
      if (defiError) throw defiError;
      setDefi(defiData);
      
      // Fetch participations with their ensembles
      const { data: participationsData, error: participationsError } = await supabase
        .from('defi_participations')
        .select(`
          id, 
          defi_id, 
          user_id, 
          ensemble_id, 
          commentaire, 
          created_at,
          ensemble:ensemble_id(
            id, 
            nom, 
            description, 
            occasion, 
            saison, 
            created_at, 
            user_id,
            vetements:tenues_vetements(
              id,
              vetement:vetement_id(*),
              position_ordre
            )
          )
        `)
        .eq('defi_id', defiId);
      
      if (participationsError) throw participationsError;
      
      // Get votes for each participation
      const enhancedParticipations = await Promise.all(participationsData.map(async (p) => {
        // Modifier pour obtenir les votes de l'ensemble, pas du défi
        const votes = await getVotesCount('ensemble', p.ensemble_id);
        const score = votes.up - votes.down;
        return { ...p, votes, score };
      }));
      
      // Sort by score
      const sortedParticipations = enhancedParticipations.sort((a, b) => b.score - a.score);
      setParticipations(sortedParticipations);
      
      // Get user votes for each participation
      const userVotes: Record<number, VoteType> = {};
      for (const p of sortedParticipations) {
        // Modifier pour obtenir le vote de l'utilisateur pour l'ensemble, pas pour le défi
        const userVote = await getUserVote('ensemble', p.ensemble_id);
        userVotes[p.ensemble_id] = userVote;
      }
      setVotingState(userVotes);
      
      setConnectionError(false);
    } catch (error) {
      console.error("Error loading data:", error);
      setConnectionError(true);
      toast({
        title: "Erreur",
        description: "Impossible de charger les participations du défi",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [defiId, toast]);
  
  // Load data on mount
  useEffect(() => {
    loadData();
    
    // Setup network status change listeners
    const handleOnlineStatusChange = () => {
      if (navigator.onLine) {
        setConnectionError(false);
        loadData();
      } else {
        setConnectionError(true);
      }
    };
    
    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);
    
    return () => {
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
    };
  }, [defiId, loadData]);
  
  // Handle vote
  const handleVote = useCallback(async (ensembleId: number, vote: VoteType) => {
    if (isSubmitting || connectionError) return;
    
    setIsSubmitting(true);
    
    try {
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
        }).sort((a, b) => b.score - a.score) // Re-sort by score
      );
      
      // Submit vote to server - vote pour l'ensemble
      await submitVote('ensemble', ensembleId, vote);
      
      toast({
        title: "Vote enregistré !",
        description: `Vous avez ${vote === 'up' ? 'aimé' : 'disliké'} cet ensemble.`,
        variant: vote === 'up' ? "default" : "destructive",
      });
    } catch (error) {
      console.error("Error voting:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer votre vote",
        variant: "destructive"
      });
      
      // Reload data to reset state
      loadData();
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, connectionError, votingState, toast, loadData]);

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

import { useState, useCallback, useEffect } from "react";
import { useCarouselNavigation } from "./useCarouselNavigation";
import { submitVote, getUserVote, getVotesCount } from "@/services/votes/voteService";
import { useToast } from "@/hooks/use-toast";
import { VoteType } from "@/services/votes/types";

export const useVotingCarousel = (defiId: number) => {
  const { toast } = useToast();
  const [defi, setDefi] = useState<any>(null);
  const [allParticipations, setAllParticipations] = useState<any[]>([]);
  const [filteredParticipations, setFilteredParticipations] = useState<any[]>([]);
  const [votingState, setVotingState] = useState<Record<number, VoteType>>({});
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const [loadComplete, setLoadComplete] = useState(false);

  const {
    currentIndex,
    setMaxItems,
    navigatePrevious,
    navigateNext
  } = useCarouselNavigation(0);

  const filterUnvotedParticipations = useCallback(() => {
    if (!allParticipations.length) return [];
    
    const unvotedParticipations = allParticipations.filter(
      p => !votingState[p.ensemble_id]
    );
    
    console.log(`Filtered to ${unvotedParticipations.length} unvoted participations out of ${allParticipations.length} total`);
    return unvotedParticipations;
  }, [allParticipations, votingState]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      if (!navigator.onLine) {
        setConnectionError(true);
        setLoading(false);
        return;
      }

      const { supabase } = await import('@/lib/supabase');
      
      const { data: defiData, error: defiError } = await supabase
        .from('defis')
        .select('*')
        .eq('id', defiId)
        .single();
      
      if (defiError) throw defiError;
      setDefi(defiData);
      
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
      
      const enhancedParticipations = await Promise.all(participationsData.map(async (p) => {
        const votes = await getVotesCount('ensemble', p.ensemble_id);
        const score = votes.up - votes.down;
        return { ...p, votes, score };
      }));
      
      const sortedParticipations = enhancedParticipations.sort((a, b) => b.score - a.score);
      setAllParticipations(sortedParticipations);
      
      const userVotes: Record<number, VoteType> = {};
      for (const p of sortedParticipations) {
        const userVote = await getUserVote('ensemble', p.ensemble_id);
        userVotes[p.ensemble_id] = userVote;
      }
      setVotingState(userVotes);
      
      setConnectionError(false);
      setLoadComplete(true);
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
  
  useEffect(() => {
    if (loadComplete) {
      const unvotedParticipations = filterUnvotedParticipations();
      setFilteredParticipations(unvotedParticipations);
      setMaxItems(unvotedParticipations.length);
    }
  }, [allParticipations, votingState, loadComplete, filterUnvotedParticipations, setMaxItems]);
  
  useEffect(() => {
    loadData();
    
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
  
  const handleVote = useCallback(async (ensembleId: number, vote: VoteType) => {
    if (isSubmitting || connectionError) return;
    
    setIsSubmitting(true);
    
    try {
      const oldVote = votingState[ensembleId];
      setVotingState(prev => ({
        ...prev,
        [ensembleId]: vote
      }));
      
      setAllParticipations(prev => 
        prev.map(p => {
          if (p.ensemble_id === ensembleId) {
            const votes = { ...p.votes };
            
            if (oldVote) {
              if (oldVote === 'up') votes.up = Math.max(0, votes.up - 1);
              if (oldVote === 'down') votes.down = Math.max(0, votes.down - 1);
            }
            
            if (vote === 'up') votes.up += 1;
            if (vote === 'down') votes.down += 1;
            
            const score = votes.up - votes.down;
            
            return { ...p, votes, score };
          }
          return p;
        }).sort((a, b) => b.score - a.score)
      );
      
      await submitVote('ensemble', ensembleId, vote);
      
      toast({
        title: "Vote enregistré !",
        description: `Vous avez ${vote === 'up' ? 'aimé' : 'disliké'} cet ensemble.`,
        variant: vote === 'up' ? "default" : "destructive",
      });
      
      if (currentIndex >= filteredParticipations.length - 1) {
        if (filteredParticipations.length === 1) {
          toast({
            title: "Terminé !",
            description: "Vous avez voté pour tous les ensembles.",
            variant: "default",
          });
        }
      }
    } catch (error) {
      console.error("Error voting:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer votre vote",
        variant: "destructive"
      });
      
      loadData();
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, connectionError, votingState, toast, loadData, filteredParticipations.length, currentIndex]);

  return {
    defi,
    participations: filteredParticipations,
    allParticipations,
    currentIndex,
    loading,
    votingState,
    isSubmitting,
    connectionError,
    handleVote,
    navigatePrevious,
    navigateNext,
    hasMoreToVote: filteredParticipations.length > 0
  };
};

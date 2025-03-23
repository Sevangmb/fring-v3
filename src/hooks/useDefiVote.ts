
import { useState, useEffect } from "react";
import { useVote, VoteType } from "./useVote";
import { supabase } from "@/lib/supabase";
import { fetchWithRetry } from "@/services/network/retryUtils";

interface EnsembleVoteState {
  [ensembleId: number]: VoteType;
}

export const useDefiVote = (defiId: number) => {
  const { submitVote: genericSubmitVote, getUserVote, getVotesCount, calculateScore } = useVote("defi", {
    tableName: "defi_votes",
  });
  
  const [votingState, setVotingState] = useState<EnsembleVoteState>({});
  const [participations, setParticipations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load participations and user votes
  useEffect(() => {
    const loadParticipations = async () => {
      setLoading(true);
      
      try {
        // Fetch participations for this defi
        const { data: participationsData, error: participationsError } = await fetchWithRetry(
          async () => {
            return await supabase
              .from('defi_participations')
              .select(`
                id, 
                defi_id, 
                user_id, 
                ensemble_id, 
                commentaire, 
                created_at
              `)
              .eq('defi_id', defiId);
          }
        );
        
        if (participationsError) throw participationsError;
        
        // Fetch ensemble details for each participation
        const participationsWithDetails = await Promise.all(participationsData.map(async (participation) => {
          // Get ensemble details
          const { data: ensemble } = await fetchWithRetry(
            async () => {
              return await supabase
                .from('tenues')
                .select(`
                  id, 
                  nom, 
                  description, 
                  occasion, 
                  saison, 
                  created_at, 
                  user_id
                `)
                .eq('id', participation.ensemble_id)
                .single();
            }
          );
          
          // Get vote counts
          const votes = await getVotesCount(participation.ensemble_id);
          const score = calculateScore(votes);
          
          // Get user vote for this ensemble
          const userVote = await getUserVote(participation.ensemble_id);
          
          // Update voting state
          setVotingState(prev => ({
            ...prev,
            [participation.ensemble_id]: userVote
          }));
          
          return {
            ...participation,
            ensemble,
            votes,
            score
          };
        }));
        
        // Sort by score
        const sortedParticipations = participationsWithDetails.sort((a, b) => b.score - a.score);
        setParticipations(sortedParticipations);
      } catch (error) {
        console.error("Erreur lors du chargement des participations:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadParticipations();
  }, [defiId, getVotesCount, getUserVote, calculateScore]);

  // Submit vote with specific logic for defi participations
  const submitVote = async (ensembleId: number, vote: VoteType): Promise<boolean> => {
    const success = await genericSubmitVote(ensembleId, vote, { defi_id: defiId });
    
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
        })
      );
    }
    
    return success;
  };

  return {
    participations,
    votingState,
    loading,
    submitVote
  };
};

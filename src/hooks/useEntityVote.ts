
import { useState, useEffect, useCallback } from "react";
import { useVote, VoteType, EntityType } from "./useVote";

interface UseEntityVoteProps {
  entityType: EntityType;
  entityId?: number;
  onVoteSubmitted?: (vote: VoteType) => void;
}

export const useEntityVote = ({ 
  entityType, 
  entityId,
  onVoteSubmitted 
}: UseEntityVoteProps) => {
  const { submitVote, getUserVote, getVotesCount, isLoading: voteLoading } = useVote(entityType);
  
  const [userVote, setUserVote] = useState<VoteType>(null);
  const [votes, setVotes] = useState<{ up: number; down: number }>({ up: 0, down: 0 });
  const [loading, setLoading] = useState(true);
  
  // Load initial vote data
  const loadVoteData = useCallback(async () => {
    if (!entityId) return;
    
    setLoading(true);
    try {
      // Get user's current vote
      const currentVote = await getUserVote(entityId);
      setUserVote(currentVote);
      
      // Get vote counts
      const voteCounts = await getVotesCount(entityId);
      setVotes(voteCounts);
    } catch (error) {
      console.error(`Erreur lors du chargement des votes pour ${entityType}:`, error);
    } finally {
      setLoading(false);
    }
  }, [entityId, entityType, getUserVote, getVotesCount]);
  
  useEffect(() => {
    loadVoteData();
  }, [loadVoteData]);
  
  // Handle vote submission
  const handleVote = async (vote: VoteType): Promise<boolean> => {
    if (!entityId) return false;
    
    const success = await submitVote(entityId, vote);
    
    if (success) {
      // Update local state optimistically
      setUserVote(vote);
      
      // Update vote counts
      const oldVote = userVote;
      const newVotes = { ...votes };
      
      // If user is changing their vote
      if (oldVote) {
        if (oldVote === 'up') newVotes.up = Math.max(0, newVotes.up - 1);
        if (oldVote === 'down') newVotes.down = Math.max(0, newVotes.down - 1);
      }
      
      // Add new vote
      if (vote === 'up') newVotes.up += 1;
      if (vote === 'down') newVotes.down += 1;
      
      setVotes(newVotes);
      
      // Call callback if provided
      if (onVoteSubmitted) {
        onVoteSubmitted(vote);
      }
    }
    
    return success;
  };
  
  // Calculate score
  const score = votes.up - votes.down;
  
  return {
    userVote,
    votes,
    score,
    loading: loading || voteLoading,
    handleVote,
    refresh: loadVoteData
  };
};

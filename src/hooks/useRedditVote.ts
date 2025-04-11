
import { useState, useEffect, useCallback } from "react";
import { submitVote, getUserVote, getVotesCount } from "@/services/votes";
import type { VoteType } from "@/services/votes/types";

interface UseRedditVoteProps {
  entityType: "ensemble" | "defi" | "tenue";
  entityId: number;
  defiId?: number;
  onVoteChange?: (vote: VoteType) => void;
  initialScore?: number;
  initialVote?: VoteType;
}

export const useRedditVote = ({
  entityType,
  entityId,
  defiId,
  onVoteChange,
  initialScore = 0,
  initialVote = null
}: UseRedditVoteProps) => {
  // Store the user's vote
  const [userVote, setUserVote] = useState<VoteType>(initialVote);
  // Store the vote count
  const [voteCount, setVoteCount] = useState({ up: 0, down: 0 });
  // Score calculation
  const [score, setScore] = useState(initialScore || 0);
  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  
  // Effective entity type for API calls
  const getEffectiveEntityType = useCallback(() => {
    // Si c'est une tenue, on utilise "ensemble" pour l'API
    return entityType === "tenue" ? "ensemble" : entityType;
  }, [entityType]);
  
  // Fetch initial user vote and count
  const fetchVoteData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const effectiveType = getEffectiveEntityType();
      
      // For votes in a defi context
      if (defiId && entityType === "tenue") {
        const vote = await getUserVote("defi", defiId);
        setUserVote(vote);
        
        const count = await getVotesCount("defi", defiId);
        setVoteCount(count);
        setScore(count.up - count.down);
        return;
      }
      
      // Standard entity votes
      const vote = await getUserVote(effectiveType, entityId);
      const count = await getVotesCount(effectiveType, entityId);
      
      setUserVote(vote);
      setVoteCount(count);
      setScore(count.up - count.down);
    } catch (error) {
      console.error("Error fetching vote data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [entityType, entityId, defiId, getEffectiveEntityType]);
  
  // Load initial data
  useEffect(() => {
    if (entityId && !initialVote && !initialScore) {
      fetchVoteData();
    }
  }, [entityId, fetchVoteData, initialVote, initialScore]);
  
  // Handle upvoting
  const handleUpvote = useCallback(async () => {
    if (isLoading) return;
    
    const effectiveType = getEffectiveEntityType();
    
    // Determine the new vote value
    const newVote: VoteType = userVote === "up" ? null : "up";
    
    // Optimistic update
    setIsLoading(true);
    const previousVote = userVote;
    setUserVote(newVote);
    
    // Update vote count optimistically
    setVoteCount(prev => {
      const newCount = { ...prev };
      
      // Remove previous vote if any
      if (previousVote === "up") newCount.up--;
      if (previousVote === "down") newCount.down--;
      
      // Add new vote if not null
      if (newVote === "up") newCount.up++;
      
      return newCount;
    });
    
    // Update score
    setScore(prev => {
      let change = 0;
      if (previousVote === "up") change--;
      if (previousVote === "down") change++;
      if (newVote === "up") change++;
      
      return prev + change;
    });
    
    try {
      // Call the appropriate API - fix the argument count issue here
      if (defiId && entityType === "tenue") {
        await submitVote("defi", defiId, newVote);
      } else {
        await submitVote(effectiveType, entityId, newVote);
      }
      
      // Notify parent component if needed
      if (onVoteChange) {
        onVoteChange(newVote);
      }
    } catch (error) {
      console.error("Error submitting vote:", error);
      // Rollback on failure
      setUserVote(previousVote);
      await fetchVoteData(); // Refresh from server
    } finally {
      setIsLoading(false);
    }
  }, [userVote, isLoading, entityId, defiId, entityType, onVoteChange, fetchVoteData, getEffectiveEntityType]);
  
  // Handle downvoting
  const handleDownvote = useCallback(async () => {
    if (isLoading) return;
    
    const effectiveType = getEffectiveEntityType();
    
    // Determine the new vote value
    const newVote: VoteType = userVote === "down" ? null : "down";
    
    // Optimistic update
    setIsLoading(true);
    const previousVote = userVote;
    setUserVote(newVote);
    
    // Update vote count optimistically
    setVoteCount(prev => {
      const newCount = { ...prev };
      
      // Remove previous vote if any
      if (previousVote === "up") newCount.up--;
      if (previousVote === "down") newCount.down--;
      
      // Add new vote if not null
      if (newVote === "down") newCount.down++;
      
      return newCount;
    });
    
    // Update score
    setScore(prev => {
      let change = 0;
      if (previousVote === "up") change--;
      if (previousVote === "down") change++;
      if (newVote === "down") change--;
      
      return prev + change;
    });
    
    try {
      // Call the appropriate API - fix the argument count issue here
      if (defiId && entityType === "tenue") {
        await submitVote("defi", defiId, newVote);
      } else {
        await submitVote(effectiveType, entityId, newVote);
      }
      
      // Notify parent component if needed
      if (onVoteChange) {
        onVoteChange(newVote);
      }
    } catch (error) {
      console.error("Error submitting vote:", error);
      // Rollback on failure
      setUserVote(previousVote);
      await fetchVoteData(); // Refresh from server
    } finally {
      setIsLoading(false);
    }
  }, [userVote, isLoading, entityId, defiId, entityType, onVoteChange, fetchVoteData, getEffectiveEntityType]);
  
  return {
    userVote,
    voteCount,
    score,
    handleUpvote,
    handleDownvote,
    isLoading,
    refresh: fetchVoteData
  };
};

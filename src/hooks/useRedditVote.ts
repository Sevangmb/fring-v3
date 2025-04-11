
import { useState, useEffect, useCallback } from "react";
import { submitVote, getUserVote, getVotesCount } from "@/services/votes";
import type { VoteType } from "@/services/votes/types";

interface UseRedditVoteProps {
  entityType: "ensemble" | "defi" | "tenue";
  entityId: number;
  defiId?: number;
  onVoteChange?: (vote: VoteType) => void;
}

export const useRedditVote = ({
  entityType,
  entityId,
  defiId,
  onVoteChange
}: UseRedditVoteProps) => {
  // Store the user's vote
  const [userVote, setUserVote] = useState<VoteType>(null);
  // Store the vote count
  const [voteCount, setVoteCount] = useState({ up: 0, down: 0 });
  // Score calculation
  const [score, setScore] = useState(0);
  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  
  // Effective entity type for API calls
  let effectiveEntityType = entityType;
  if (entityType === "tenue") {
    effectiveEntityType = "ensemble";
  }
  
  // Fetch initial user vote and count
  const fetchVoteData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // For votes in a defi context
      if (defiId && entityType === "tenue") {
        const vote = await getUserVote("defi", defiId, entityId);
        setUserVote(vote);
        
        const count = await getVotesCount("defi", defiId, entityId);
        setVoteCount(count);
        setScore(count.up - count.down);
        return;
      }
      
      // Standard entity votes
      const vote = await getUserVote(effectiveEntityType, entityId);
      const count = await getVotesCount(effectiveEntityType, entityId);
      
      setUserVote(vote);
      setVoteCount(count);
      setScore(count.up - count.down);
    } catch (error) {
      console.error("Error fetching vote data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [entityType, entityId, defiId, effectiveEntityType]);
  
  // Load initial data
  useEffect(() => {
    if (entityId) {
      fetchVoteData();
    }
  }, [entityId, fetchVoteData]);
  
  // Handle upvoting
  const handleUpvote = useCallback(async () => {
    if (isLoading) return;
    
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
      // Call the appropriate API
      if (defiId && entityType === "tenue") {
        await submitVote("defi", defiId, newVote, entityId);
      } else {
        await submitVote(effectiveEntityType, entityId, newVote);
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
  }, [userVote, isLoading, entityId, defiId, entityType, effectiveEntityType, onVoteChange, fetchVoteData]);
  
  // Handle downvoting
  const handleDownvote = useCallback(async () => {
    if (isLoading) return;
    
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
      // Call the appropriate API
      if (defiId && entityType === "tenue") {
        await submitVote("defi", defiId, newVote, entityId);
      } else {
        await submitVote(effectiveEntityType, entityId, newVote);
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
  }, [userVote, isLoading, entityId, defiId, entityType, effectiveEntityType, onVoteChange, fetchVoteData]);
  
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


import React, { useState, useEffect } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { getUserVote } from "@/services/votes/getUserVote";
import { submitVote as submitDefiVote } from "@/services/defi/votes";
import { submitVote as submitEnsembleVote } from "@/services/votes/submitVote";
import { getVoteCount } from "@/services/votes/getVoteCount";
import { VoteType } from "@/services/votes/types";

interface RedditStyleVoterProps {
  entityType: "ensemble" | "tenue" | "defi";
  entityId: number;
  defiId?: number;
  size?: "sm" | "md" | "lg";
  onVoteChange?: (vote: "up" | "down" | null) => void;
  showScore?: boolean;
}

const RedditStyleVoter: React.FC<RedditStyleVoterProps> = ({
  entityType,
  entityId,
  defiId,
  size = "md",
  onVoteChange,
  showScore = false
}) => {
  const [userVote, setUserVote] = useState<VoteType>(null);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24
  };

  const buttonSizes = {
    sm: "p-1",
    md: "p-2",
    lg: "p-3"
  };

  const iconSize = iconSizes[size];
  const buttonSize = buttonSizes[size];

  // Load saved vote and score from database
  useEffect(() => {
    const loadVoteAndScore = async () => {
      if (!entityId) return;
      
      setLoading(true);
      try {
        // Get vote from database
        const vote = await getUserVote(entityType, entityId);
        if (vote) {
          console.log(`Found saved vote for ${entityType}_${entityId}: ${vote}`);
          setUserVote(vote);
        }
        
        // Get score from database
        if (showScore) {
          try {
            const voteCount = await getVoteCount(entityType, entityId);
            setScore(voteCount.up - voteCount.down);
          } catch (err) {
            console.error(`Error getting vote count for ${entityType} ${entityId}:`, err);
          }
        }
        
        setInitialized(true);
      } catch (err) {
        console.error("Error loading vote data:", err);
      } finally {
        setLoading(false);
      }
    };
    
    loadVoteAndScore();
  }, [entityId, entityType, showScore]);

  const handleVote = async (vote: VoteType) => {
    if (loading || !initialized) return;
    
    const newVote = userVote === vote ? null : vote;
    
    // Update local state immediately for better UX
    setLoading(true);
    setUserVote(newVote);
    
    // Update score based on vote change
    if (showScore) {
      if (userVote === "up" && newVote === null) setScore(prev => prev - 1);
      else if (userVote === "down" && newVote === null) setScore(prev => prev + 1);
      else if (userVote === null && newVote === "up") setScore(prev => prev + 1);
      else if (userVote === null && newVote === "down") setScore(prev => prev - 1);
      else if (userVote === "up" && newVote === "down") setScore(prev => prev - 2);
      else if (userVote === "down" && newVote === "up") setScore(prev => prev + 2);
    }
    
    try {
      // Submit vote to database
      if (entityType === "defi" || (entityType === "tenue" && defiId)) {
        // For defi votes
        await submitDefiVote(defiId!, entityId, newVote);
      } else {
        // For ensemble votes
        await submitEnsembleVote(entityType, entityId, newVote);
      }
      
      // Notify parent component
      if (onVoteChange) {
        onVoteChange(newVote);
      }
    } catch (err) {
      console.error("Error submitting vote:", err);
      
      // Revert local state on error
      setUserVote(userVote);
      
      // Revert score change on error
      if (showScore) {
        if (userVote === "up" && newVote === null) setScore(prev => prev + 1);
        else if (userVote === "down" && newVote === null) setScore(prev => prev - 1);
        else if (userVote === null && newVote === "up") setScore(prev => prev - 1);
        else if (userVote === null && newVote === "down") setScore(prev => prev + 1);
        else if (userVote === "up" && newVote === "down") setScore(prev => prev + 2);
        else if (userVote === "down" && newVote === "up") setScore(prev => prev - 2);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        size="icon"
        variant="ghost"
        disabled={loading || !initialized}
        onClick={() => handleVote("up")}
        className={cn(
          buttonSize,
          userVote === "up" && "text-green-500 bg-green-50",
          "rounded-full"
        )}
      >
        <ThumbsUp size={iconSize} />
      </Button>
      
      {showScore && (
        <span className={cn(
          "font-semibold",
          score > 0 ? "text-green-600" : score < 0 ? "text-red-600" : "text-gray-500"
        )}>
          {score}
        </span>
      )}
      
      <Button
        size="icon"
        variant="ghost"
        disabled={loading || !initialized}
        onClick={() => handleVote("down")}
        className={cn(
          buttonSize,
          userVote === "down" && "text-red-500 bg-red-50",
          "rounded-full"
        )}
      >
        <ThumbsDown size={iconSize} />
      </Button>
    </div>
  );
};

export default RedditStyleVoter;

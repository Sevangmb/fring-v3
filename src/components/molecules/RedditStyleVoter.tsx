
import React, { useState, useEffect } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { getUserVote } from "@/services/defi/votes/getUserVote";
import { submitVote as submitDefiVote } from "@/services/defi/votes";
import { submitVote as submitEnsembleVote } from "@/services/votes/submitVote";
import { getVoteCount } from "@/services/votes/getVoteCount";

// LocalStorage key for storing votes
const VOTES_STORAGE_KEY = "fring-votes";

interface RedditStyleVoterProps {
  entityType: "ensemble" | "tenue" | "defi";
  entityId: number;
  defiId?: number;
  size?: "sm" | "md" | "lg";
  onVoteChange?: (vote: "up" | "down" | null) => void;
  showScore?: boolean;
  persistVotes?: boolean;
}

const RedditStyleVoter: React.FC<RedditStyleVoterProps> = ({
  entityType,
  entityId,
  defiId,
  size = "md",
  onVoteChange,
  showScore = false,
  persistVotes = true
}) => {
  const [userVote, setUserVote] = useState<"up" | "down" | null>(null);
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

  // Load saved vote and score from localStorage and/or server
  useEffect(() => {
    const loadVoteAndScore = async () => {
      if (!entityId) return;
      
      setLoading(true);
      try {
        // Try to get vote from localStorage first
        let vote: "up" | "down" | null = null;
        
        if (persistVotes) {
          try {
            const savedVotes = localStorage.getItem(VOTES_STORAGE_KEY);
            if (savedVotes) {
              const votesData = JSON.parse(savedVotes);
              const voteKey = `${entityType}_${entityId}`;
              vote = votesData[voteKey] || null;
              
              if (vote) {
                console.log(`Found saved vote for ${voteKey}: ${vote}`);
                setUserVote(vote);
              }
            }
          } catch (err) {
            console.error("Error loading vote from localStorage:", err);
          }
        }
        
        // If no vote in localStorage, try to get from server
        if (!vote) {
          if (entityType === "defi" || (entityType === "tenue" && defiId)) {
            // Get vote for tenue in defi context
            const serverVote = await getUserVote(defiId!, entityId);
            setUserVote(serverVote);
          } else {
            // TODO: Implement getUserVote for ensembles
            // For now, we'll use null as default
          }
        }
        
        // Get score from server
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
  }, [entityId, entityType, defiId, showScore, persistVotes]);

  const handleVote = async (vote: "up" | "down") => {
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
      // Save to local storage if persistVotes is enabled
      if (persistVotes) {
        try {
          const savedVotes = localStorage.getItem(VOTES_STORAGE_KEY) || "{}";
          const votesData = JSON.parse(savedVotes);
          
          const voteKey = `${entityType}_${entityId}`;
          votesData[voteKey] = newVote;
          
          localStorage.setItem(VOTES_STORAGE_KEY, JSON.stringify(votesData));
          console.log(`Saved vote to localStorage: ${voteKey} = ${newVote}`);
        } catch (err) {
          console.error("Error saving vote to localStorage:", err);
        }
      }
      
      // Submit vote to server
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

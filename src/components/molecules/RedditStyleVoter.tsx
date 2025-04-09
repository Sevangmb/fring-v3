
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { VoteButtons } from "@/components/ui/vote-buttons";
import { VoteType } from "@/services/votes/types";
import { writeLog } from "@/services/logs";
import { calculateScore } from "@/services/votes/types";
import { useVote } from "@/hooks/useVote";

interface RedditStyleVoterProps {
  entityType: "ensemble" | "defi" | "tenue";
  entityId: number;
  ensembleId?: number;
  initialScore?: number;
  initialVote?: VoteType;
  size?: "sm" | "md" | "lg";
  vertical?: boolean;
  showScore?: boolean;
  className?: string;
  onVoteChange?: (type: VoteType) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

const RedditStyleVoter: React.FC<RedditStyleVoterProps> = ({
  entityType,
  entityId,
  ensembleId,
  initialScore,
  initialVote = null,
  size = "md",
  vertical = true,
  showScore = true,
  className,
  onVoteChange,
  isLoading: externalIsLoading,
  disabled: externalDisabled
}) => {
  const { toast } = useToast();
  const {
    userVote,
    votesCount,
    isLoading: internalIsLoading,
    isOffline,
    submitVote,
    loadVoteData
  } = useVote(
    entityType, 
    entityId,
    {
      onVoteSuccess: (vote) => {
        if (onVoteChange) onVoteChange(vote);
        toast({
          title: vote === "up" ? "Upvote" : "Downvote",
          description: vote === "up" ? "Vous avez apprécié cet élément" : "Vous n'avez pas apprécié cet élément",
          variant: vote === "up" ? "default" : "destructive",
        });
      },
      onVoteError: (error) => {
        toast({
          title: "Erreur de vote",
          description: error.message || "Impossible d'enregistrer votre vote",
          variant: "destructive",
        });
      }
    }
  );
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate score from vote counts
  const score = initialScore !== undefined 
    ? initialScore 
    : votesCount 
      ? calculateScore(votesCount) 
      : 0;

  // Combined loading and disabled states
  const isLoading = externalIsLoading || internalIsLoading || isSubmitting;
  const isDisabled = externalDisabled || isOffline;

  // Handle upvote
  const handleUpvote = async () => {
    if (isLoading || isDisabled) return;
    
    setIsSubmitting(true);
    try {
      // If already upvoted, remove vote. Otherwise upvote
      const newVote = userVote === "up" ? null : "up";
      await submitVote(newVote);
      
      writeLog(
        `${newVote === "up" ? "Upvote" : "Vote retiré"} pour ${entityType}`,
        "info",
        `ID: ${entityId}`,
        "votes"
      );
    } catch (error) {
      console.error("Erreur lors du vote:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle downvote
  const handleDownvote = async () => {
    if (isLoading || isDisabled) return;
    
    setIsSubmitting(true);
    try {
      // If already downvoted, remove vote. Otherwise downvote
      const newVote = userVote === "down" ? null : "down";
      await submitVote(newVote);
      
      writeLog(
        `${newVote === "down" ? "Downvote" : "Vote retiré"} pour ${entityType}`,
        "info",
        `ID: ${entityId}`,
        "votes"
      );
    } catch (error) {
      console.error("Erreur lors du vote:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <VoteButtons
      score={score}
      userVote={userVote || initialVote}
      size={size}
      onUpvote={handleUpvote}
      onDownvote={handleDownvote}
      isLoading={isLoading}
      vertical={vertical}
      showScore={showScore}
      className={className}
    />
  );
};

export default RedditStyleVoter;

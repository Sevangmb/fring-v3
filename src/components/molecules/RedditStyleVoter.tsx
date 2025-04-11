
import React from "react";
import { useRedditVote } from "@/hooks/useRedditVote";
import { VoteButtons } from "@/components/ui/vote-buttons";

interface RedditStyleVoterProps {
  entityType: "ensemble" | "defi" | "tenue";
  entityId: number;
  defiId?: number;
  size?: "sm" | "md" | "lg";
  onVoteChange?: (vote: "up" | "down" | null) => void;
  showScore?: boolean;
  vertical?: boolean;
  className?: string;
  initialScore?: number;
  initialVote?: "up" | "down" | null;
  disabled?: boolean; // Ajout de la prop disabled
}

const RedditStyleVoter: React.FC<RedditStyleVoterProps> = ({
  entityType,
  entityId,
  defiId,
  size = "md",
  onVoteChange,
  showScore = false,
  vertical = true,
  className,
  initialScore,
  initialVote,
  disabled = false
}) => {
  // Use our custom hook for vote logic
  const {
    userVote,
    voteCount,
    score,
    handleUpvote,
    handleDownvote,
    isLoading
  } = useRedditVote({
    entityType: entityType, 
    entityId: entityId,
    defiId: defiId,
    onVoteChange: onVoteChange,
    initialScore,
    initialVote
  });

  return (
    <VoteButtons
      userVote={userVote}
      score={score}
      size={size}
      onUpvote={handleUpvote}
      onDownvote={handleDownvote}
      isLoading={isLoading}
      disabled={disabled}
      vertical={vertical}
      showScore={showScore}
      className={className}
    />
  );
};

export default RedditStyleVoter;

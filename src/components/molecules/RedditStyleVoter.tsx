
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
}

const RedditStyleVoter: React.FC<RedditStyleVoterProps> = ({
  entityType,
  entityId,
  defiId,
  size = "md",
  onVoteChange,
  showScore = false,
  vertical = true,
  className
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
    onVoteChange: onVoteChange
  });

  return (
    <VoteButtons
      userVote={userVote}
      score={score}
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


import React from "react";
import { VoteButtons } from "@/components/ui/vote-buttons";
import { useRedditVote } from "@/hooks/useRedditVote";
import { VoteType, EntityType } from "@/services/votes/types";

interface RedditStyleVoterProps {
  entityType: EntityType;
  entityId: number;
  defiId?: number;
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
  defiId,
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
  const {
    userVote,
    score,
    isLoading: internalIsLoading,
    handleUpvote,
    handleDownvote
  } = useRedditVote({
    entityType,
    entityId,
    defiId,
    initialVote,
    onVoteSuccess: onVoteChange
  });
  
  const finalScore = initialScore !== undefined ? initialScore : score;
  const isLoading = externalIsLoading || internalIsLoading;

  return (
    <VoteButtons
      score={finalScore}
      userVote={userVote}
      size={size}
      onUpvote={handleUpvote}
      onDownvote={handleDownvote}
      isLoading={isLoading}
      disabled={externalDisabled}
      vertical={vertical}
      showScore={showScore}
      className={className}
    />
  );
};

export default RedditStyleVoter;

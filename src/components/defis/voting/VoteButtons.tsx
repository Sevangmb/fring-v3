
import React, { useState } from "react";
import RedditStyleVoter from "@/components/molecules/RedditStyleVoter";
import { VoteType } from "@/services/votes/types";

interface VoteButtonsProps {
  userVote: VoteType;
  onVote: (vote: VoteType) => void;
  size?: "sm" | "md" | "lg";
  showLabels?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  connectionError?: boolean;
  className?: string;
  showScore?: boolean;
  votesCount?: { up: number; down: number };
}

const VoteButtons: React.FC<VoteButtonsProps> = ({
  userVote,
  onVote,
  size = "md",
  showLabels = false,
  isLoading = false,
  disabled = false,
  connectionError = false,
  className = "",
  showScore = false,
  votesCount = { up: 0, down: 0 }
}) => {
  const [justVoted, setJustVoted] = useState<VoteType>(null);
  
  // Calculate the score from up and down votes
  const score = votesCount.up - votesCount.down;
  
  // Handle the vote change
  const handleVoteChange = (vote: VoteType) => {
    setJustVoted(vote);
    onVote(vote);
    
    // Reset the feedback after a delay
    setTimeout(() => {
      setJustVoted(null);
    }, 1000);
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <RedditStyleVoter
        entityType="ensemble"
        entityId={0} // This is a dummy ID since we're controlling vote state externally
        size={size}
        onVoteChange={handleVoteChange}
        showScore={showScore}
      />
      
      {showLabels && (
        <div className="mt-2 text-center text-sm">
          {connectionError ? (
            <span className="text-red-500">Connexion perdue</span>
          ) : justVoted ? (
            <span className={justVoted === "up" ? "text-green-500" : "text-red-500"}>
              {justVoted === "up" ? "Upvoté" : "Downvoté"}
            </span>
          ) : (
            <span>Voter</span>
          )}
        </div>
      )}
    </div>
  );
};

export default VoteButtons;

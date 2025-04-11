
import React from "react";
import RedditStyleVoter from "@/components/molecules/RedditStyleVoter";
import { VoteType } from "@/services/votes/types";
import { Badge } from "@/components/ui/badge";

interface DefiEnsembleVoterProps {
  defiId: number;
  ensembleId: number;
  className?: string;
  showScore?: boolean;
  size?: "sm" | "md" | "lg";
  onVoteChange?: (vote: VoteType) => void;
}

/**
 * Composant de vote style Reddit spécifique pour les ensembles dans un défi
 */
const DefiEnsembleVoter: React.FC<DefiEnsembleVoterProps> = ({
  defiId,
  ensembleId,
  className = "",
  showScore = true,
  size = "md",
  onVoteChange
}) => {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <RedditStyleVoter
        entityType="ensemble"
        entityId={ensembleId}
        size={size}
        showScore={showScore}
        onVoteChange={onVoteChange}
      />
    </div>
  );
};

export default DefiEnsembleVoter;

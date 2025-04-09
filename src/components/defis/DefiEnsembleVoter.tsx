
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
  vertical?: boolean;
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
  onVoteChange,
  vertical = true
}) => {
  return (
    <div className={`flex ${vertical ? "flex-col" : "flex-row"} items-center ${className}`}>
      <RedditStyleVoter
        entityType="ensemble"
        entityId={ensembleId}
        size={size}
        vertical={vertical}
        showScore={showScore}
        onVoteChange={onVoteChange}
      />
    </div>
  );
};

export default DefiEnsembleVoter;

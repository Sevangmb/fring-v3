
import React from "react";
import { Award } from "lucide-react";
import { Text } from "@/components/atoms/Typography";
import { useVotingCarousel } from "./voting/hooks/useVotingCarousel";
import { organizeVetementsByType } from "./voting/helpers/vetementOrganizer";
import VotingControls from "./voting/VotingControls";
import EnsembleDetail from "./voting/EnsembleDetail";
import RankingList from "./voting/RankingList";
import LoadingState from "./voting/LoadingState";
import EmptyState from "./voting/EmptyState";

interface VotingCarouselProps {
  defiId: number;
}

const VotingCarousel: React.FC<VotingCarouselProps> = ({ defiId }) => {
  const {
    defi,
    participations,
    currentIndex,
    loading,
    votingState,
    handleVote,
    navigatePrevious,
    navigateNext
  } = useVotingCarousel(defiId);

  if (loading) {
    return <LoadingState />;
  }

  if (participations.length === 0) {
    return <EmptyState />;
  }

  const currentEnsemble = participations[currentIndex]?.ensemble;
  const currentVotes = participations[currentIndex]?.votes || { up: 0, down: 0 };
  const currentScore = participations[currentIndex]?.score || 0;
  const currentEnsembleId = participations[currentIndex]?.ensemble_id;
  const userVote = votingState[currentEnsembleId];
  const vetementsByType = organizeVetementsByType(currentEnsemble);

  return (
    <div className="space-y-6">
      {defi && (
        <div className="mb-4 text-center">
          <h2 className="text-2xl font-bold">{defi.titre}</h2>
          <p className="text-muted-foreground">{defi.description}</p>
        </div>
      )}
      
      <VotingControls
        currentIndex={currentIndex}
        totalItems={participations.length}
        onPrevious={navigatePrevious}
        onNext={navigateNext}
        score={currentScore}
      />
      
      <EnsembleDetail
        ensemble={currentEnsemble}
        votes={currentVotes}
        ensembleId={currentEnsembleId}
        userVote={userVote}
        vetementsByType={vetementsByType}
        onVote={handleVote}
      />
      
      <RankingList participations={participations} />
    </div>
  );
};

export default VotingCarousel;

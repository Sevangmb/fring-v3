
import React from "react";
import { Award, WifiOff } from "lucide-react";
import { Text } from "@/components/atoms/Typography";
import { useVotingCarousel } from "./voting/hooks/useVotingCarousel";
import { organizeVetementsByType } from "./voting/helpers/vetementOrganizer";
import VotingControls from "./voting/VotingControls";
import EnsembleDetail from "./voting/EnsembleDetail";
import RankingList from "./voting/RankingList";
import LoadingState from "./voting/LoadingState";
import EmptyState from "./voting/EmptyState";
import { Alert, Button, Box } from "@mui/material";

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
    isSubmitting,
    connectionError,
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
      {connectionError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <WifiOff size={18} />
              <Text>Problème de connexion. Vérifiez votre connexion internet.</Text>
            </Box>
            <Button 
              variant="outlined" 
              color="error" 
              size="small"
              onClick={() => window.location.reload()}
            >
              Réessayer
            </Button>
          </Box>
        </Alert>
      )}
      
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
        disabled={connectionError}
      />
      
      <EnsembleDetail
        ensemble={currentEnsemble}
        votes={currentVotes}
        ensembleId={currentEnsembleId}
        userVote={userVote}
        vetementsByType={vetementsByType}
        onVote={(vote) => handleVote(currentEnsembleId, vote)}
        isLoading={isSubmitting}
        connectionError={connectionError}
      />
      
      <RankingList participations={participations} />
    </div>
  );
};

export default VotingCarousel;

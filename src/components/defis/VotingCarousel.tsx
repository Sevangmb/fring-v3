
import React from "react";
import { Alert, Box, Button, CircularProgress, Grid, Paper, Typography } from "@mui/material";
import { Award, WifiOff } from "lucide-react";
import { Text } from "@/components/atoms/Typography";
import { useVotingCarousel } from "./voting/hooks/useVotingCarousel";
import { organizeVetementsByType } from "./voting/helpers/vetementOrganizer";
import VotingControls from "./voting/VotingControls";
import VoteCarousel from "./voting/VoteCarousel";
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
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {connectionError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <WifiOff size={18} />
              <Typography variant="body1">Problème de connexion. Vérifiez votre connexion internet.</Typography>
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
        <Box sx={{ mb: 2, textAlign: 'center' }}>
          <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold' }}>
            {defi.titre}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {defi.description}
          </Typography>
        </Box>
      )}
      
      <VotingControls
        currentIndex={currentIndex}
        totalItems={participations.length}
        onPrevious={navigatePrevious}
        onNext={navigateNext}
        score={currentScore}
        disabled={connectionError}
      />
      
      <Paper 
        variant="outlined" 
        sx={{ 
          p: 3, 
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '500px'  // Ajout d'une hauteur minimale
        }}
      >
        <Box sx={{ flexGrow: 1, width: '100%', mb: 3 }}>
          <VoteCarousel
            ensembles={[currentEnsemble]} 
            userVotes={{ [currentEnsembleId]: userVote }}
            isLoading={isSubmitting}
            onVote={(ensembleId, vote) => handleVote(ensembleId, vote)}
            isOffline={connectionError}
          />
        </Box>
      </Paper>
      
      <RankingList participations={participations} />
    </Box>
  );
};

export default VotingCarousel;


import React from "react";
import { Box, Card, CardContent, CardHeader, Typography, CircularProgress, Avatar } from "@mui/material";
import Carousel from "react-material-ui-carousel";
import { VoteType } from "@/services/votes/types";
import EnsembleDetail from "./EnsembleDetail";
import VoteButtons from "./VoteButtons";

interface VoteCarouselProps {
  ensembles: any[];
  userVotes: Record<number, VoteType>;
  votesCount?: Record<number, { up: number; down: number }>;
  isLoading: boolean;
  onVote: (ensembleId: number, vote: VoteType) => void;
  isOffline?: boolean;
  showScores?: boolean;
}

const VoteCarousel: React.FC<VoteCarouselProps> = ({
  ensembles,
  userVotes,
  votesCount = {},
  isLoading,
  onVote,
  isOffline = false,
  showScores = false
}) => {
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!ensembles || ensembles.length === 0) {
    return (
      <Card variant="outlined">
        <CardHeader title="Aucun ensemble à afficher" />
        <CardContent>
          <Typography align="center" color="text.secondary">
            Il n'y a pas encore de participations pour ce défi.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box sx={{ width: '100%', height: 'auto', minHeight: '400px', position: 'relative' }}>
      <Carousel
        animation="slide"
        autoPlay={false}
        navButtonsAlwaysVisible={true}
        navButtonsProps={{
          style: {
            backgroundColor: '#9b87f5',
            borderRadius: '50%',
            color: 'white',
            padding: '8px',
            margin: '0 10px'
          }
        }}
        indicatorContainerProps={{
          style: {
            marginTop: '20px',
            textAlign: 'center'
          }
        }}
        sx={{ width: '100%', height: '100%' }}
      >
        {ensembles.map((ensemble) => (
          <Box key={ensemble.id} sx={{ p: 2, height: '100%' }}>
            <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardHeader 
                title={ensemble.nom || "Ensemble sans nom"}
                titleTypographyProps={{ variant: 'h6' }}
                avatar={ensemble.user_email ? (
                  <Avatar sx={{ bgcolor: '#9b87f5' }}>
                    {ensemble.user_email.substring(0, 1).toUpperCase()}
                  </Avatar>
                ) : null}
                subheader={ensemble.user_email || ""}
                sx={{ borderBottom: '1px solid #eeeeee' }}
              />
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Box sx={{ mb: 3, width: '100%' }}>
                  <EnsembleDetail ensemble={ensemble} />
                </Box>
                
                <VoteButtons
                  userVote={userVotes[ensemble.id] || null}
                  onVote={(vote) => onVote(ensemble.id, vote)}
                  size="lg"
                  showLabels={true}
                  isLoading={isLoading}
                  disabled={isOffline}
                  connectionError={isOffline}
                  showScore={showScores}
                  votesCount={votesCount[ensemble.id] || { up: 0, down: 0 }}
                />
              </CardContent>
            </Card>
          </Box>
        ))}
      </Carousel>
    </Box>
  );
};

export default VoteCarousel;

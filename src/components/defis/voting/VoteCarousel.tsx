
import React from "react";
import { Box, Card, CardContent, CardHeader, Typography, Button } from "@mui/material";
import Carousel from "react-material-ui-carousel";
import { VoteType } from "@/services/votes/types";
import EnsembleDetail from "./EnsembleDetail";
import VoteButtons from "./VoteButtons";

interface VoteCarouselProps {
  ensembles: any[];
  userVotes: Record<number, VoteType>;
  isLoading: boolean;
  onVote: (ensembleId: number, vote: VoteType) => void;
  isOffline?: boolean;
}

const VoteCarousel: React.FC<VoteCarouselProps> = ({
  ensembles,
  userVotes,
  isLoading,
  onVote,
  isOffline = false
}) => {
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
    <Carousel
      animation="slide"
      navButtonsAlwaysVisible={true}
      navButtonsProps={{
        style: {
          backgroundColor: '#9b87f5',
          borderRadius: '50%',
          color: 'white'
        }
      }}
      indicatorContainerProps={{
        style: {
          marginTop: '10px'
        }
      }}
    >
      {ensembles.map((ensemble) => (
        <Box key={ensemble.id} sx={{ p: 1 }}>
          <Card variant="outlined">
            <CardHeader 
              title={ensemble.nom || "Ensemble sans nom"}
              titleTypographyProps={{ variant: 'h6' }}
            />
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
              />
            </CardContent>
          </Card>
        </Box>
      ))}
    </Carousel>
  );
};

export default VoteCarousel;

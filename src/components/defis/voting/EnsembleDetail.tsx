
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import EnsembleImages from "@/components/ensembles/EnsembleImages";
import VoteProgress from "./VoteProgress";
import VoteButtons from "./VoteButtons";
import { Box, Typography, Alert } from "@mui/material";
import { WifiOff } from "lucide-react";

interface EnsembleDetailProps {
  ensemble: any;
  votes: { up: number; down: number };
  ensembleId: number;
  userVote: 'up' | 'down' | null;
  vetementsByType: Record<string, any[]>;
  onVote: (vote: 'up' | 'down') => void;
  isLoading?: boolean;
  connectionError?: boolean;
}

const EnsembleDetail: React.FC<EnsembleDetailProps> = ({
  ensemble,
  votes,
  ensembleId,
  userVote,
  vetementsByType,
  onVote,
  isLoading = false,
  connectionError = false
}) => {
  // Helper function to handle the vote
  const handleVote = (vote: 'up' | 'down') => {
    onVote(vote);
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle>{ensemble?.nom || "Ensemble sans nom"}</CardTitle>
      </CardHeader>
      
      <CardContent>
        {connectionError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <WifiOff size={16} />
              <Typography variant="body2">
                Problème de connexion. Vérifiez votre connexion internet.
              </Typography>
            </Box>
          </Alert>
        )}
        
        {ensemble && (
          <>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              mb: 2
            }}>
              <EnsembleImages 
                vetementsByType={vetementsByType} 
                className="w-full max-w-md mx-auto"
              />
            </Box>
            
            {ensemble.description && (
              <Typography 
                variant="body2" 
                color="text.secondary" 
                className="mt-4"
              >
                {ensemble.description}
              </Typography>
            )}
            
            <VoteProgress upVotes={votes.up} downVotes={votes.down} />
          </>
        )}
      </CardContent>
      
      <CardFooter>
        <VoteButtons
          userVote={userVote}
          onVote={handleVote}
          size="md"
          showLabels={true}
          isLoading={isLoading}
          disabled={isLoading}
          connectionError={connectionError}
        />
      </CardFooter>
    </Card>
  );
};

export default EnsembleDetail;

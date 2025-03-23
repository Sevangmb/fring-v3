
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import EnsembleImages from "@/components/ensembles/EnsembleImages";
import VoteProgress from "./VoteProgress";
import VoteButtons from "./VoteButtons";
import { Box, Typography } from "@mui/material";

interface EnsembleDetailProps {
  ensemble: any;
  votes: { up: number; down: number };
  ensembleId: number;
  userVote: 'up' | 'down' | null;
  vetementsByType: Record<string, any[]>;
  onVote: (ensembleId: number, vote: 'up' | 'down') => void;
  isLoading?: boolean;
}

const EnsembleDetail: React.FC<EnsembleDetailProps> = ({
  ensemble,
  votes,
  ensembleId,
  userVote,
  vetementsByType,
  onVote,
  isLoading = false
}) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle>{ensemble?.nom || "Ensemble sans nom"}</CardTitle>
      </CardHeader>
      
      <CardContent>
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
          ensembleId={ensembleId}
          userVote={userVote}
          onVote={onVote}
          size="md"
          variant="default"
          showLabels={true}
          isLoading={isLoading}
          disabled={isLoading}
        />
      </CardFooter>
    </Card>
  );
};

export default EnsembleDetail;

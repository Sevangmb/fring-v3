
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import EnsembleImages from "@/components/ensembles/EnsembleImages";
import VoteProgress from "./VoteProgress";
import VoteButtons from "./VoteButtons";

interface EnsembleDetailProps {
  ensemble: any;
  votes: { up: number; down: number };
  ensembleId: number;
  userVote: 'up' | 'down' | null;
  vetementsByType: Record<string, any[]>;
  onVote: (ensembleId: number, vote: 'up' | 'down') => void;
}

const EnsembleDetail: React.FC<EnsembleDetailProps> = ({
  ensemble,
  votes,
  ensembleId,
  userVote,
  vetementsByType,
  onVote
}) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle>{ensemble?.nom || "Ensemble sans nom"}</CardTitle>
      </CardHeader>
      
      <CardContent>
        {ensemble && (
          <>
            <EnsembleImages vetementsByType={vetementsByType} />
            
            {ensemble.description && (
              <p className="mt-4 text-sm text-muted-foreground">
                {ensemble.description}
              </p>
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
        />
      </CardFooter>
    </Card>
  );
};

export default EnsembleDetail;

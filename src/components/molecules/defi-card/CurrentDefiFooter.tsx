
import React from "react";
import { Text } from "@/components/atoms/Typography";
import { Award, Vote, Shirt } from "lucide-react";
import { DefiState } from "./types";
import ParticiperDefiDialog from "../ParticiperDefiDialog";
import { Button } from "@/components/ui/button";
import VotingDialog from "@/components/defis/VotingDialog";
import { useVotingDialog } from "@/hooks/useVotingDialog";

interface CurrentDefiFooterProps {
  defiId: number;
  defiTitle: string;
  participantsCount: number;
  votesCount: number;
  state: DefiState;
  onParticipation?: () => void;
}

const CurrentDefiFooter: React.FC<CurrentDefiFooterProps> = ({
  defiId,
  defiTitle,
  participantsCount,
  votesCount,
  state,
  onParticipation
}) => {
  const { participation, participantEnsembleId, ensembleName, userHasVoted } = state;
  const { 
    ensembles, 
    allEnsembles,
    votedCount,
    totalCount,
    loading, 
    open, 
    setOpen, 
    openDialog, 
    handleVoteSubmitted,
    winner
  } = useVotingDialog(defiId);
  
  // Utiliser le nombre de participants de l'état s'il est disponible
  const displayParticipantsCount = state.participantsCount > 0 ? state.participantsCount : participantsCount;
  const allVoted = totalCount > 0 && votedCount === totalCount;
  
  return (
    <div className="flex w-full justify-between items-center">
      <div className="flex items-center gap-4">
        <Text className="text-sm text-muted-foreground">
          <Award className="h-4 w-4 inline mr-1" />
          {displayParticipantsCount} participant{displayParticipantsCount > 1 ? 's' : ''}
        </Text>
        {state.votesCount > 0 && (
          <Text className="text-sm text-muted-foreground">
            <Vote className="h-4 w-4 inline mr-1" />
            {state.votesCount} vote{state.votesCount > 1 ? 's' : ''}
          </Text>
        )}
        {winner && (
          <Text className="text-sm font-medium text-primary">
            <Award className="h-4 w-4 inline mr-1 text-yellow-500" />
            Gagnant: {winner.ensembleName}
          </Text>
        )}
      </div>
      <div className="flex gap-2">
        {participation ? (
          <>
            {ensembleName && (
              <div className="flex items-center gap-1 text-sm text-primary">
                <Shirt className="h-4 w-4" />
                <span>{ensembleName}</span>
              </div>
            )}
            <Button 
              variant="outline" 
              size="sm"
              onClick={openDialog}
              className="flex items-center gap-1 text-sm font-medium"
              disabled={loading || ensembles.length === 0}
            >
              <Vote className="h-4 w-4" />
              <span>
                {allVoted ? 
                  "Tous les votes effectués" : 
                  `Voter (${votedCount}/${totalCount})`
                }
              </span>
            </Button>
            
            <VotingDialog
              open={open}
              onOpenChange={setOpen}
              ensembles={ensembles}
              onVoteSubmitted={handleVoteSubmitted}
              votedCount={votedCount}
              totalCount={totalCount}
              defiId={defiId}
            />
          </>
        ) : (
          <ParticiperDefiDialog 
            defiId={defiId} 
            defiTitle={defiTitle} 
            onParticipation={onParticipation}
          />
        )}
      </div>
    </div>
  );
};

export default CurrentDefiFooter;

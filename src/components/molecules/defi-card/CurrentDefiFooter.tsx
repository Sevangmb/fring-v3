
import React from "react";
import { Text } from "@/components/atoms/Typography";
import { Award, Vote, Shirt } from "lucide-react";
import { DefiState } from "./types";
import VoteDefiDialog from "../VoteDefiDialog";
import ParticiperDefiDialog from "../ParticiperDefiDialog";
import VoterDialog from "../VoterDialog";

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

  return (
    <div className="flex w-full justify-between items-center">
      <div className="flex items-center gap-4">
        <Text className="text-sm text-muted-foreground">
          <Award className="h-4 w-4 inline mr-1" />
          {participantsCount} participants
        </Text>
        {votesCount > 0 && (
          <Text className="text-sm text-muted-foreground">
            <Vote className="h-4 w-4 inline mr-1" />
            {votesCount} votes
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
            <VoteDefiDialog 
              defiId={defiId} 
              defiTitle={defiTitle} 
              ensembleId={participantEnsembleId || participation.ensemble_id}
            />
          </>
        ) : (
          <ParticiperDefiDialog 
            defiId={defiId} 
            defiTitle={defiTitle} 
            onParticipation={onParticipation}
          />
        )}
        <div className="ml-2">
          <VoterDialog 
            elementId={defiId} 
            elementType="defi"
            onVoteSubmitted={() => {}}
            disabled={userHasVoted}
          />
        </div>
      </div>
    </div>
  );
};

export default CurrentDefiFooter;

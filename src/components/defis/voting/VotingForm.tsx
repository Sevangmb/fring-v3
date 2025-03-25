
import React from "react";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Text } from "@/components/atoms/Typography";
import { Progress } from "@/components/ui/progress";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import VetementsList from "./VetementsList";
import { VoteType } from "@/services/votes/types";

interface VotingFormProps {
  currentEnsemble: any;
  currentIndex: number;
  totalEnsembles: number;
  isSubmitting: boolean;
  onVote: (vote: VoteType) => Promise<void>;
}

const VotingForm: React.FC<VotingFormProps> = ({
  currentEnsemble,
  currentIndex,
  totalEnsembles,
  isSubmitting,
  onVote
}) => {
  // Extract vetements from the ensemble
  const vetements = currentEnsemble.vetements || [];
  
  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-center text-primary">
          Voter pour {currentEnsemble.nom}
        </DialogTitle>
        <DialogDescription className="text-center">
          Donnez votre avis sur cet ensemble.
        </DialogDescription>
      </DialogHeader>
      
      <div className="mt-2 text-center">
        <h3 className="font-semibold text-lg">{currentEnsemble.nom}</h3>
        <Text variant="small" className="text-muted-foreground">
          {currentEnsemble.description}
        </Text>
      </div>

      {/* Progress bar for voting progress */}
      <div className="mt-2 mb-2">
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>{currentIndex + 1} sur {totalEnsembles}</span>
          <span>{Math.round((currentIndex + 1) / totalEnsembles * 100)}%</span>
        </div>
        <Progress value={(currentIndex + 1) / totalEnsembles * 100} className="h-2" />
      </div>
      
      <VetementsList vetements={vetements} />
      
      <div className="mt-6 flex justify-center space-x-4">
        <button
          onClick={() => onVote('up')}
          disabled={isSubmitting}
          className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white rounded-md p-4 min-w-[5rem] transition-colors disabled:opacity-50"
        >
          {isSubmitting ? (
            <div className="animate-spin h-5 w-5 border-2 border-white border-opacity-50 border-t-transparent rounded-full"></div>
          ) : (
            <ThumbsUp className="h-6 w-6" />
          )}
        </button>
        
        <button
          onClick={() => onVote('down')}
          disabled={isSubmitting}
          className="flex items-center justify-center bg-red-400 hover:bg-red-500 text-white rounded-md p-4 min-w-[5rem] transition-colors disabled:opacity-50"
        >
          {isSubmitting ? (
            <div className="animate-spin h-5 w-5 border-2 border-white border-opacity-50 border-t-transparent rounded-full"></div>
          ) : (
            <ThumbsDown className="h-6 w-6" />
          )}
        </button>
      </div>
      
      <div className="mt-2 text-center text-sm text-muted-foreground">
        {currentIndex + 1} sur {totalEnsembles} ensembles
      </div>
    </>
  );
};

export default VotingForm;

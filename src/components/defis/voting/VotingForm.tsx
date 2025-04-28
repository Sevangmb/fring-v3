
import React, { useEffect } from "react";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Text } from "@/components/atoms/Typography";
import { Progress } from "@/components/ui/progress";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import VetementsList from "./VetementsList";
import { VoteType } from "@/services/votes/types";
import EnsembleImages from "@/components/ensembles/EnsembleImages";
import { organizeVetementsByType } from "./helpers/vetementOrganizer";

interface VotingFormProps {
  currentEnsemble: any;
  currentIndex: number;
  totalEnsembles: number;
  isSubmitting: boolean;
  onVote: (vote: VoteType) => Promise<void>;
  error?: string | null;
}

const VotingForm: React.FC<VotingFormProps> = ({
  currentEnsemble,
  currentIndex,
  totalEnsembles,
  isSubmitting,
  onVote,
  error
}) => {
  useEffect(() => {
    console.log("VotingForm - Current Ensemble:", currentEnsemble);
  }, [currentEnsemble]);

  // Early return if no ensemble
  if (!currentEnsemble) {
    return (
      <div className="text-center p-4">
        <Text className="text-muted-foreground">
          Aucun ensemble à afficher pour le moment
        </Text>
      </div>
    );
  }

  const vetements = currentEnsemble.vetements || [];
  const vetementsByType = organizeVetementsByType(currentEnsemble);
  
  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-center text-primary">
          Voter pour {currentEnsemble.nom}
        </DialogTitle>
        <DialogDescription className="text-center">
          Donnez votre avis sur cet ensemble pour le concours.
        </DialogDescription>
      </DialogHeader>
      
      {/* Error message if any */}
      {error && (
        <div className="mt-2 text-center text-red-500 text-sm">
          {error}
        </div>
      )}
      
      <div className="mt-2 text-center">
        <h3 className="font-semibold text-lg">{currentEnsemble.nom}</h3>
        <Text variant="small" className="text-muted-foreground">
          {currentEnsemble.description}
        </Text>
      </div>

      {/* Progress bar */}
      <div className="mt-2 mb-2">
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>Ensemble {currentIndex + 1} sur {totalEnsembles}</span>
          <span>{Math.round(((currentIndex + 1) / totalEnsembles) * 100)}% complété</span>
        </div>
        <Progress 
          value={((currentIndex + 1) / totalEnsembles) * 100} 
          className="h-2" 
        />
      </div>
      
      {/* Ensemble images */}
      <div className="my-4">
        <EnsembleImages 
          vetementsByType={vetementsByType} 
          className="aspect-video w-full"
        />
      </div>
      
      {/* List of vetements */}
      <VetementsList vetements={vetements} />
      
      {/* Vote buttons */}
      <div className="mt-6 flex justify-center space-x-4">
        <button
          onClick={() => onVote('up')}
          disabled={isSubmitting}
          className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white rounded-md p-4 min-w-[5rem] transition-colors disabled:opacity-50"
          aria-label="J'aime"
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
          aria-label="Je n'aime pas"
        >
          {isSubmitting ? (
            <div className="animate-spin h-5 w-5 border-2 border-white border-opacity-50 border-t-transparent rounded-full"></div>
          ) : (
            <ThumbsDown className="h-6 w-6" />
          )}
        </button>
      </div>
      
      <div className="mt-2 text-center text-sm text-muted-foreground">
        Ensemble {currentIndex + 1} sur {totalEnsembles} - Votre vote compte pour le classement final!
      </div>
    </>
  );
};

export default VotingForm;

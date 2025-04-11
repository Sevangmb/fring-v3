
import React, { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogTitle,
  DialogHeader,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ThumbsUp, X, ThumbsDown } from "lucide-react";
import { useEnsembleVote } from "@/hooks/useEnsembleVote";
import VoteDialogContent from "./vote-dialog/VoteDialogContent";
import VoteSuccessView from "./vote-dialog/VoteSuccessView";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface VoteDefiDialogProps {
  defiId: number;
  defiTitle?: string;
  ensembleId: number;
}

const VoteDefiDialog: React.FC<VoteDefiDialogProps> = ({
  defiId,
  defiTitle,
  ensembleId
}) => {
  // État local du dialogue
  const [open, setOpen] = useState(false);
  
  // Utilisation du hook personalisé pour la logique de vote
  const {
    ensemble,
    loading,
    error,
    vetementsByType,
    hasVoted,
    setHasVoted,
    handleVote,
    userVote,
    isVoting,
    isOffline,
    loadVoteData,
    loadEnsemble
  } = useEnsembleVote({ 
    ensembleId,
    onVoteSuccess: () => setHasVoted(true)
  });
  
  // Gestion de la fermeture manuelle
  const handleClose = () => setOpen(false);
  
  // Gestion de l'ouverture
  const handleOpen = () => {
    console.log(`Ouverture de la boîte de dialogue de vote pour l'ensemble ${ensembleId}`);
    setOpen(true);
    setHasVoted(false);
    loadVoteData();
    loadEnsemble();
  };
  
  // Gestion de la continuation après vote
  const handleContinue = () => {
    setOpen(false);
  };
  
  return (
    <>
      <Button 
        variant="outline" 
        size="sm"
        onClick={handleOpen}
        className="flex items-center gap-1 text-sm font-medium"
      >
        <ThumbsUp className="h-4 w-4" />
        <span>Voter</span>
      </Button>

      <Dialog 
        open={open} 
        onOpenChange={(newState) => {
          // Empêcher la fermeture automatique lors du vote
          // On permet la fermeture manuelle uniquement par bouton/X
          if (newState === false && !hasVoted) {
            setOpen(false); // Fermeture manuelle autorisée
          } else {
            setOpen(newState);
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              Voter pour {ensemble?.nom || defiTitle || 'cet ensemble'}
            </DialogTitle>
            <DialogDescription className="text-center text-muted-foreground">
              Donnez votre avis sur cet ensemble.
            </DialogDescription>
            <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </DialogHeader>
          
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {/* Affichage conditionnel : contenu normal ou confirmation de vote */}
          {hasVoted ? (
            <VoteSuccessView onContinue={handleContinue} />
          ) : (
            <VoteDialogContent 
              ensemble={ensemble}
              loading={loading}
              error={error}
              vetementsByType={vetementsByType}
              hasVoted={hasVoted}
              userVote={userVote}
              isVoting={isVoting}
              isOffline={isOffline}
              onVote={handleVote}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VoteDefiDialog;

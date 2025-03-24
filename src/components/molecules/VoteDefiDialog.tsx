
import React, { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogTitle,
  DialogHeader,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ThumbsUp, X, WifiOff } from "lucide-react";
import VoteButtons from "@/components/defis/voting/VoteButtons";
import EnsembleContentDisplay from "./EnsembleContentDisplay";
import { useEnsembleVoteDialog } from "@/hooks/useEnsembleVoteDialog";
import { Alert, Box, Typography } from "@mui/material";
import { useEntityVote } from "@/hooks/useEntityVote";

interface VoteDefiDialogProps {
  defiId: number;
  defiTitle?: string;
  ensembleId?: number;
}

const VoteDefiDialog: React.FC<VoteDefiDialogProps> = ({
  defiId,
  defiTitle,
  ensembleId
}) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const handleClose = () => setOpen(false);
  
  // Utiliser useEntityVote pour voter directement sur le défi si ensembleId n'est pas fourni
  const {
    userVote: defiVote,
    handleVote: handleDefiVote,
    isSubmitting: isDefiVoting,
    connectionError: defiConnectionError
  } = useEntityVote({
    entityType: 'defi',
    entityId: defiId
  });
  
  // Utiliser useEnsembleVoteDialog seulement si ensembleId est fourni
  const {
    ensemble,
    loading,
    error,
    vetementsByType,
    userVote,
    isSubmitting,
    connectionError,
    resetState,
    loadEnsemble,
    onVote
  } = useEnsembleVoteDialog({ 
    ensembleId: ensembleId || 0, 
    onClose: handleClose,
    skip: !ensembleId // Skip if ensembleId is not provided
  });

  const handleOpen = () => {
    setOpen(true);
    if (ensembleId) {
      resetState();
    }
  };

  useEffect(() => {
    if (open && ensembleId) {
      loadEnsemble();
    }
  }, [open, ensembleId, loadEnsemble]);
  
  const handleVote = (voteValue: 'up' | 'down') => {
    if (ensembleId) {
      // Vote sur l'ensemble
      onVote(voteValue);
    } else {
      // Vote directement sur le défi
      handleDefiVote(voteValue).then(success => {
        if (success) {
          handleClose();
        }
      });
    }
  };

  // Déterminer si c'est un vote sur un défi direct ou sur un ensemble
  const isDefiDirectVote = !ensembleId;
  
  // Variables d'état à utiliser dans le rendu
  const activeVote = isDefiDirectVote ? defiVote : userVote;
  const activeIsSubmitting = isDefiDirectVote ? isDefiVoting : isSubmitting;
  const activeConnectionError = isDefiDirectVote ? defiConnectionError : connectionError;

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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              Voter pour {defiTitle || 'ce défi'}
              <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </DialogClose>
            </DialogTitle>
            <p className="text-center text-muted-foreground">
              {isDefiDirectVote 
                ? "Donnez votre avis sur ce défi." 
                : "Donnez votre avis sur cet ensemble."}
            </p>
          </DialogHeader>
          
          {activeConnectionError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <WifiOff size={16} />
                <Typography variant="body2">
                  Problème de connexion. Vérifiez votre connexion internet.
                </Typography>
              </Box>
            </Alert>
          )}
          
          {/* Afficher l'aperçu de l'ensemble seulement si ensembleId est fourni */}
          {!isDefiDirectVote && (
            <EnsembleContentDisplay
              ensemble={ensemble}
              loading={loading}
              error={error}
              vetementsByType={vetementsByType}
            />
          )}
          
          <VoteButtons
            ensembleId={ensembleId || defiId} // Utiliser defiId si ensembleId n'est pas fourni
            userVote={activeVote}
            onVote={handleVote}
            size="lg"
            isLoading={activeIsSubmitting}
            disabled={!isDefiDirectVote && loading || activeIsSubmitting}
            connectionError={activeConnectionError}
            className="pt-4"
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VoteDefiDialog;


import React, { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogTitle,
  DialogHeader,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ThumbsUp, X } from "lucide-react";
import VoteButtons from "@/components/defis/voting/VoteButtons";
import EnsembleContentDisplay from "./EnsembleContentDisplay";
import { useEnsembleVoteDialog } from "@/hooks/useEnsembleVoteDialog";

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
  const [open, setOpen] = useState(false);
  
  const handleClose = () => setOpen(false);
  
  const {
    ensemble,
    loading,
    error,
    vetementsByType,
    userVote,
    resetState,
    loadEnsemble,
    onVote
  } = useEnsembleVoteDialog({ 
    ensembleId, 
    onClose: handleClose 
  });

  const handleOpen = () => {
    setOpen(true);
    resetState();
  };

  useEffect(() => {
    if (open && ensembleId) {
      loadEnsemble();
    }
  }, [open, ensembleId, loadEnsemble]);
  
  const handleVote = (ensembleId: number, vote: 'up' | 'down') => {
    onVote(vote);
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
              Donnez votre avis sur ce défi.
            </p>
          </DialogHeader>
          
          <EnsembleContentDisplay
            ensemble={ensemble}
            loading={loading}
            error={error}
            vetementsByType={vetementsByType}
          />
          
          <VoteButtons
            ensembleId={ensembleId}
            userVote={userVote}
            onVote={handleVote}
            size="lg"
            className="pt-4"
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VoteDefiDialog;

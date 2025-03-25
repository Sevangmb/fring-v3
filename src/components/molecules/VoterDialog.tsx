
import React, { useState } from "react";
import { ThumbsUp, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { VoteType, EntityType } from "@/services/votes/types";
import { useVote } from "@/hooks/useVote";
import { Typography, Box } from "@mui/material";
import VoteButtons from "@/components/voting/VoteButtons";

interface VoterDialogProps {
  elementId: number;
  elementType: EntityType;
  onVoteSubmitted?: (vote: VoteType) => void;
  title?: string;
  description?: string;
  disabled?: boolean;
}

const VoterDialog: React.FC<VoterDialogProps> = ({
  elementId,
  elementType,
  onVoteSubmitted,
  title,
  description,
  disabled = false
}) => {
  const [open, setOpen] = useState(false);
  const {
    submitVote,
    userVote,
    isLoading,
    isOffline,
    loadVoteData
  } = useVote(elementType, elementId, {
    onVoteSuccess: () => {
      if (onVoteSubmitted && userVote) {
        onVoteSubmitted(userVote);
      }

      // Ajout d'un délai avant de fermer la boîte de dialogue pour donner à l'utilisateur
      // le temps de voir la confirmation visuelle du vote
      setTimeout(() => {
        setOpen(false);
      }, 1000); // Délai de 1 seconde
    }
  });

  const handleOpen = () => {
    setOpen(true);
    loadVoteData();
  };

  const handleVote = async (vote: VoteType) => {
    await submitVote(vote);
    // La fermeture du dialogue est maintenant gérée par le callback onVoteSuccess
  };

  const dialogTitle = title || `Voter pour cet ${elementType === 'tenue' ? 'ensemble' : 'élément'}`;
  const dialogDescription = description || `Donnez votre avis sur cet élément.`;

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={handleOpen}
        disabled={disabled}
        className="flex items-center gap-1 text-sm font-medium"
      >
        <ThumbsUp className="h-4 w-4" />
        <span>Voter</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription className="text-center text-muted-foreground">
              {dialogDescription}
            </DialogDescription>
            <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </DialogHeader>
          
          <Box sx={{
            padding: '16px 0',
            textAlign: 'center'
          }}>
            <VoteButtons userVote={userVote} onVote={handleVote} size="lg" isLoading={isLoading} connectionError={isOffline} className="py-4" />
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VoterDialog;

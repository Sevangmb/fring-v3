
import React, { useState } from "react";
import { 
  ThumbsUp, 
  X 
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogClose,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { VoteType, EntityType } from "@/services/votes/types";
import VoteButtons from "@/components/defis/voting/VoteButtons";
import { useVote } from "@/hooks/useVote";
import { Typography, Box } from "@mui/material";

interface VoterDialogProps {
  elementId: number;
  elementType: EntityType;
  onVoteSubmitted?: (vote: VoteType) => void;
  title?: string;
  description?: string;
}

const VoterDialog: React.FC<VoterDialogProps> = ({ 
  elementId, 
  elementType,
  onVoteSubmitted,
  title,
  description
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
    }
  });
  
  const handleOpen = () => {
    setOpen(true);
    loadVoteData();
  };
  
  const handleVote = async (vote: VoteType) => {
    await submitVote(vote);
    // Ferme la boîte de dialogue après le vote
    setOpen(false);
  };
  
  const dialogTitle = title || `Voter pour cet ${elementType === 'ensemble' ? 'ensemble' : 'élément'}`;
  const dialogDescription = description || `Donnez votre avis sur ce${elementType === 'ensemble' ? 't ensemble' : ' défi'}.`;
  
  return (
    <>
      <Button 
        variant="outline" 
        size="icon"
        onClick={handleOpen}
        disabled={isLoading}
      >
        <ThumbsUp className="h-4 w-4" />
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
          
          <Box sx={{ padding: '16px 0', textAlign: 'center' }}>
            <VoteButtons
              userVote={userVote}
              onVote={handleVote}
              size="lg"
              isLoading={isLoading}
              connectionError={isOffline}
              className="py-4"
            />
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VoterDialog;

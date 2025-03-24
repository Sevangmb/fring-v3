
import React, { useState } from "react";
import { 
  ThumbsUp, 
  X, 
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { VoteType, EntityType } from "@/services/votes/types";
import VoteButtons from "@/components/defis/voting/VoteButtons";
import { useVote } from "@/hooks/useVote";

interface VoterDialogProps {
  elementId: number;
  elementType: EntityType;
  onVoteSubmitted?: (vote: VoteType) => void;
}

const VoterDialog: React.FC<VoterDialogProps> = ({ 
  elementId, 
  elementType,
  onVoteSubmitted
}) => {
  const [open, setOpen] = useState(false);
  
  const {
    submitVote,
    userVote,
    isLoading,
    isOffline,
    loadVoteData
  } = useVote(elementType, elementId, {
    onVoteSuccess: (vote) => {
      if (onVoteSubmitted) {
        onVoteSubmitted(vote);
      }
    }
  });
  
  const handleOpen = () => {
    setOpen(true);
    loadVoteData();
  };
  
  const handleVote = async (vote: 'up' | 'down') => {
    await submitVote(vote);
  };
  
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
            <DialogTitle>Votez pour cet élément</DialogTitle>
            <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </DialogHeader>
          
          <VoteButtons
            userVote={userVote}
            onVote={handleVote}
            size="lg"
            isLoading={isLoading}
            connectionError={isOffline}
            className="py-4"
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VoterDialog;

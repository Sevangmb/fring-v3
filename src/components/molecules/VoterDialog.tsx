
import React, { useState, useEffect } from "react";
import { 
  ThumbsUp, 
  ThumbsDown, 
  X, 
  Loader2
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { VoteType, EntityType } from "@/services/votes/types";
import { submitVote as submitEntityVote } from "@/services/votes/voteService";
import { getUserVote } from "@/services/votes/getUserVote";
import { submitVote } from "@/services/defi/votes";

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
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [userVote, setUserVote] = useState<VoteType>(null);
  const [isVoting, setIsVoting] = useState(false);
  const [selectedVote, setSelectedVote] = useState<VoteType>(null);
  
  useEffect(() => {
    const fetchUserVote = async () => {
      try {
        const vote = await getUserVote(elementType, elementId);
        setUserVote(vote);
      } catch (error) {
        console.error("Erreur lors de la récupération du vote:", error);
      }
    };
    
    if (open) {
      fetchUserVote();
    }
  }, [open, elementId, elementType]);
  
  const handleVoteClick = async (vote: VoteType) => {
    setIsVoting(true);
    setSelectedVote(vote);
    
    try {
      console.info("Attempting to vote:", { elementType, elementId, vote });
      console.info("Soumission du vote: type=" + elementType + ", id=" + elementId + ", vote=" + vote);
      
      let success = false;
      
      if (elementType === 'defi') {
        // Pour un vote sur un défi, passer null comme ensemble_id
        success = await submitVote(elementId, null, vote);
      } else {
        success = await submitEntityVote(elementType, elementId, vote);
      }
      
      if (success) {
        // Si le vote a réussi, mettre à jour l'état local
        setUserVote(vote);
        
        // Notifier le parent
        if (onVoteSubmitted) {
          onVoteSubmitted(vote);
        }
        
        toast({
          title: "Vote enregistré",
          description: vote === 'up' ? "Vous avez aimé cet élément" : "Vous n'avez pas aimé cet élément",
          variant: vote === 'up' ? 'default' : 'destructive',
        });
      } else {
        toast({
          title: "Erreur",
          description: "Impossible d'enregistrer votre vote",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erreur lors du vote:", error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible d'enregistrer votre vote",
        variant: "destructive",
      });
    } finally {
      setIsVoting(false);
    }
  };
  
  return (
    <>
      <Button 
        variant="outline" 
        size="icon"
        onClick={() => setOpen(true)}
        disabled={isVoting}
      >
        {isVoting && selectedVote === 'up' ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <ThumbsUp className="h-4 w-4" />
        )}
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
          <div className="grid gap-4 py-4">
            <div className="flex items-center space-x-2">
              <Button 
                variant={userVote === 'up' ? 'default' : 'outline'}
                onClick={() => handleVoteClick('up')}
                disabled={isVoting}
              >
                {isVoting && selectedVote === 'up' ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <ThumbsUp className="mr-2 h-4 w-4" />
                )}
                <span>J'aime</span>
              </Button>
              <Button 
                variant={userVote === 'down' ? 'default' : 'outline'}
                onClick={() => handleVoteClick('down')}
                disabled={isVoting}
              >
                {isVoting && selectedVote === 'down' ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <ThumbsDown className="mr-2 h-4 w-4" />
                )}
                <span>Je n'aime pas</span>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VoterDialog;

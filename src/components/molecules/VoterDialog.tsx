
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { useEntityVote } from "@/hooks/useEntityVote";
import { EntityType, VoteType } from "@/hooks/useVote";

interface VoterDialogProps {
  elementId?: number;
  elementType?: EntityType;
  onVoteSubmitted?: (vote: VoteType) => void;
}

const VoterDialog: React.FC<VoterDialogProps> = ({
  elementId,
  elementType = "vetement",
  onVoteSubmitted,
}) => {
  const [open, setOpen] = useState(false);
  
  const { handleVote, loading } = useEntityVote({
    entityType: elementType,
    entityId: elementId,
    onVoteSubmitted
  });
  
  const handleVoteClick = async (vote: VoteType) => {
    const success = await handleVote(vote);
    if (success) {
      setOpen(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          Voter
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Voter pour cet élément</DialogTitle>
          <DialogDescription>
            Donnez votre avis sur {elementType === "vetement" ? "ce vêtement" : 
                                 elementType === "ensemble" ? "cet ensemble" : 
                                 "ce défi"}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-center gap-4 py-4">
          <Button 
            onClick={() => handleVoteClick("up")}
            variant="outline" 
            size="lg"
            disabled={loading}
            className="flex-1 max-w-40 flex flex-col items-center p-6 hover:bg-green-50 hover:border-green-200"
          >
            <ThumbsUp className="h-8 w-8 mb-2 text-green-500" />
            <span>J'aime</span>
          </Button>
          
          <Button 
            onClick={() => handleVoteClick("down")}
            variant="outline" 
            size="lg"
            disabled={loading}
            className="flex-1 max-w-40 flex flex-col items-center p-6 hover:bg-red-50 hover:border-red-200"
          >
            <ThumbsDown className="h-8 w-8 mb-2 text-red-500" />
            <span>Je n'aime pas</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VoterDialog;

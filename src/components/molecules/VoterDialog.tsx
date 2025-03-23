
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VoterDialogProps {
  elementId?: number;
  elementType?: "vetement" | "ensemble" | "defi";
  onVoteSubmitted?: (vote: "up" | "down") => void;
}

const VoterDialog: React.FC<VoterDialogProps> = ({
  elementId,
  elementType = "vetement",
  onVoteSubmitted,
}) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  
  const handleVote = (vote: "up" | "down") => {
    // Ici, vous pouvez implémenter la logique pour enregistrer le vote en base de données
    console.log(`Vote ${vote} enregistré pour ${elementType} #${elementId}`);
    
    // Afficher un toast pour confirmer le vote
    toast({
      title: "Vote enregistré !",
      description: `Vous avez ${vote === "up" ? "aimé" : "disliké"} cet élément.`,
      variant: vote === "up" ? "default" : "destructive",
    });
    
    // Fermer le dialog
    setOpen(false);
    
    // Appeler le callback si fourni
    if (onVoteSubmitted) {
      onVoteSubmitted(vote);
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
            onClick={() => handleVote("up")}
            variant="outline" 
            size="lg"
            className="flex-1 max-w-40 flex flex-col items-center p-6 hover:bg-green-50 hover:border-green-200"
          >
            <ThumbsUp className="h-8 w-8 mb-2 text-green-500" />
            <span>J'aime</span>
          </Button>
          
          <Button 
            onClick={() => handleVote("down")}
            variant="outline" 
            size="lg"
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

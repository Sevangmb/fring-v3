
import React, { useState, useEffect } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { submitVote as submitEnsembleVote } from "@/services/ensemble/votes";
import { submitVote as submitDefiVote } from "@/services/defi/votes/submitVote";
import { getUserVote as getUserEnsembleVote } from "@/services/ensemble/getUserVote";
import { getUserVote as getUserDefiVote } from "@/services/defi/votes/getUserVote";
import { VoteType } from "@/services/votes/types";
import { useToast } from "@/hooks/use-toast";

interface VoterDialogProps {
  elementId: number;
  elementType: "ensemble" | "defi";
  onVoteSubmitted?: (vote: "up" | "down") => void;
  ensembleId?: number | string;
}

const VoterDialog: React.FC<VoterDialogProps> = ({
  elementId,
  elementType,
  onVoteSubmitted,
  ensembleId
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userVote, setUserVote] = useState<VoteType>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Charger le vote actuel de l'utilisateur
    const loadUserVote = async () => {
      try {
        let vote: VoteType = null;
        
        if (elementType === "ensemble") {
          vote = await getUserEnsembleVote(elementId);
        } else if (elementType === "defi") {
          // Make sure ensembleId is always treated as a number
          const ensembleIdNumber = ensembleId !== undefined ? 
            (typeof ensembleId === 'string' ? parseInt(ensembleId, 10) : ensembleId) : 0;
          
          vote = await getUserDefiVote(elementId, ensembleIdNumber);
        }
        
        setUserVote(vote);
      } catch (error) {
        console.error("Erreur lors du chargement du vote:", error);
      }
    };

    loadUserVote();
  }, [elementId, elementType, ensembleId]);

  const handleVote = async (vote: "up" | "down") => {
    setIsSubmitting(true);
    try {
      let success = false;
      
      if (elementType === "ensemble") {
        success = await submitEnsembleVote(elementId, vote);
      } else if (elementType === "defi") {
        // Ensure ensembleId is always a number when passed to submitDefiVote
        const ensembleIdNumber = ensembleId !== undefined ? 
          (typeof ensembleId === 'string' ? parseInt(ensembleId, 10) : ensembleId) : 0;
        
        success = await submitDefiVote(elementId, vote, ensembleIdNumber);
      }
      
      if (success) {
        setUserVote(vote);
        toast({
          title: "Vote enregistré",
          description: vote === "up" ? "Vous aimez cet élément" : "Vous n'aimez pas cet élément",
        });
        
        if (onVoteSubmitted) {
          onVoteSubmitted(vote);
        }
        
        setIsOpen(false);
      } else {
        toast({
          title: "Erreur",
          description: "Impossible d'enregistrer votre vote. Veuillez réessayer.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erreur lors du vote:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement de votre vote.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant={userVote ? "default" : "outline"}
          size="icon"
          className={`rounded-full ${
            userVote === "up"
              ? "bg-green-500 hover:bg-green-600"
              : userVote === "down"
              ? "bg-red-500 hover:bg-red-600"
              : ""
          }`}
        >
          {userVote === "up" ? (
            <ThumbsUp className="h-4 w-4" />
          ) : userVote === "down" ? (
            <ThumbsDown className="h-4 w-4" />
          ) : (
            <ThumbsUp className="h-4 w-4" />
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Voter</DialogTitle>
          <DialogDescription>
            Donnez votre avis sur {elementType === "ensemble" ? "cet ensemble" : "ce défi"}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center space-x-4 py-4">
          <Button
            onClick={() => handleVote("up")}
            disabled={isSubmitting}
            className="bg-green-500 hover:bg-green-600"
          >
            <ThumbsUp className="h-5 w-5 mr-2" />
            J'aime
          </Button>
          <Button
            onClick={() => handleVote("down")}
            disabled={isSubmitting}
            variant="outline"
            className="border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600"
          >
            <ThumbsDown className="h-5 w-5 mr-2" />
            Je n'aime pas
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VoterDialog;

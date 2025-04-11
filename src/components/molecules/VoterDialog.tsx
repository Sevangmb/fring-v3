
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
import { VoteType } from "@/services/votes/types";
import { useToast } from "@/hooks/use-toast";
import RedditStyleVoter from "@/components/molecules/RedditStyleVoter";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface VoterDialogProps {
  elementId: number;
  elementType: "ensemble" | "defi";
  onVoteSubmitted?: (vote: "up" | "down") => void;
  onVoteUpdated?: () => Promise<void>;
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
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Convert ensembleId to number to prevent type errors
  const ensembleIdAsNumber = ensembleId !== undefined 
    ? (typeof ensembleId === 'string' ? parseInt(ensembleId, 10) : ensembleId) 
    : undefined;

  useEffect(() => {
    const loadUserVote = async () => {
      try {
        setError(null);
        let vote: VoteType = null;
        
        if (elementType === "ensemble") {
          const { getUserVote: getUserEnsembleVote } = await import("@/services/ensemble/getUserVote");
          vote = await getUserEnsembleVote(elementId);
        } else if (elementType === "defi") {
          const { getUserVote: getUserDefiVote } = await import("@/services/defi/votes/getUserVote");
          // Pass the numeric version of ensembleId
          vote = await getUserDefiVote(elementId, ensembleIdAsNumber || 0);
        }
        
        setUserVote(vote);
      } catch (error) {
        console.error("Erreur lors du chargement du vote:", error);
        setError("Erreur lors du chargement de votre vote. Veuillez réessayer.");
        const { writeLog } = await import("@/services/logs");
        writeLog(
          "Erreur lors du chargement du vote utilisateur", 
          "error", 
          `Element type: ${elementType}, Element ID: ${elementId}, Error: ${error instanceof Error ? error.message : String(error)}`,
          "votes"
        );
      }
    };

    loadUserVote();
  }, [elementId, elementType, ensembleIdAsNumber]);

  const handleVoteInDialog = async (vote: VoteType) => {
    if (!vote) return;
    setIsSubmitting(true);
    setError(null);
    
    try {
      let success = false;
      
      if (elementType === "ensemble") {
        const { submitVote: submitEnsembleVote } = await import("@/services/ensemble/votes");
        success = await submitEnsembleVote(elementId, vote);
      } else if (elementType === "defi") {
        const { submitVote: submitDefiVote } = await import("@/services/defi/votes/submitVote");
        // Ensure ensembleIdAsNumber is a number when passing to the function
        success = await submitDefiVote(elementId, ensembleIdAsNumber || 0, vote);
      }
      
      if (success) {
        setUserVote(vote);
        toast({
          title: "Vote enregistré",
          description: vote === "up" ? "Vous aimez cet élément" : "Vous n'aimez pas cet élément",
        });
        
        if (onVoteSubmitted && (vote === "up" || vote === "down")) {
          onVoteSubmitted(vote);
        }
        
        setIsOpen(false);
      } else {
        setError("Impossible d'enregistrer votre vote. Veuillez réessayer.");
        toast({
          title: "Erreur",
          description: "Impossible d'enregistrer votre vote. Veuillez réessayer.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erreur lors du vote:", error);
      setError("Une erreur est survenue lors de l'enregistrement de votre vote.");
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
        
        {error && (
          <Alert variant="destructive" className="mb-4 bg-red-100 text-red-900 border-red-200 dark:bg-red-900 dark:text-red-50 dark:border-red-800">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="flex justify-center py-4">
          <RedditStyleVoter
            entityType={elementType}
            entityId={elementId}
            defiId={ensembleIdAsNumber}
            initialVote={userVote}
            size="lg"
            vertical={false}
            showScore={false}
            onVoteChange={(vote) => handleVoteInDialog(vote)}
            isLoading={isSubmitting}
            className="gap-6"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VoterDialog;


import React, { useState, useEffect } from "react";
import { ThumbsUp, ThumbsDown, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { VoteType } from "@/services/votes/types";
import { useToast } from "@/hooks/use-toast";
import RedditStyleVoter from "@/components/molecules/RedditStyleVoter";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { fetchEnsembleById } from "@/services/ensemble/fetchEnsembleById";
import EnsembleContentDisplay from "@/components/molecules/EnsembleContentDisplay";
import { organizeVetementsByType } from "@/components/defis/voting/helpers/vetementOrganizer";

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
  const [ensemble, setEnsemble] = useState<any>(null);
  const [vetementsByType, setVetementsByType] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Convert ensembleId to number to prevent type errors
  const ensembleIdAsNumber = ensembleId !== undefined 
    ? (typeof ensembleId === 'string' ? parseInt(ensembleId, 10) : ensembleId) 
    : undefined;
    
  // ID de l'ensemble à afficher et pour lequel voter
  const targetEnsembleId = elementType === "ensemble" ? elementId : ensembleIdAsNumber;

  // Charger l'ensemble
  useEffect(() => {
    const loadEnsemble = async () => {
      if (!targetEnsembleId || !isOpen) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Charger les données de l'ensemble
        const ensembleData = await fetchEnsembleById(targetEnsembleId);
        if (!ensembleData) {
          throw new Error("Impossible de charger les détails de l'ensemble");
        }
        
        setEnsemble(ensembleData);
        
        // Organiser les vêtements par type
        const vetements = ensembleData?.vetements || [];
        const organizedVetements = organizeVetementsByType(vetements);
        setVetementsByType(organizedVetements);
      } catch (err) {
        console.error("Erreur lors du chargement de l'ensemble:", err);
        setError("Erreur lors du chargement de l'ensemble");
      } finally {
        setLoading(false);
      }
    };
    
    loadEnsemble();
  }, [targetEnsembleId, isOpen]);

  useEffect(() => {
    const loadUserVote = async () => {
      try {
        setError(null);
        let vote: VoteType = null;
        
        if (elementType === "ensemble") {
          const { getUserVote: getUserEnsembleVote } = await import("@/services/ensemble/votes");
          vote = await getUserEnsembleVote(elementId);
        } else if (elementType === "defi") {
          const { getUserVote: getUserDefiVote } = await import("@/services/defi/votes");
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

    if (isOpen) {
      loadUserVote();
    }
  }, [elementId, elementType, ensembleIdAsNumber, isOpen]);

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
          description: vote === "up" ? "Vous aimez cet ensemble" : "Vous n'aimez pas cet ensemble",
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
            <ThumbsUp className="h-4 w-4 text-white" />
          ) : userVote === "down" ? (
            <ThumbsDown className="h-4 w-4 text-white" />
          ) : (
            <ThumbsUp className="h-4 w-4" />
          )}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px]">
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-4 w-4" />
          <span className="sr-only">Fermer</span>
        </DialogClose>

        <DialogHeader>
          <DialogTitle>Voter pour {ensemble?.nom || 'cet ensemble'}</DialogTitle>
          <DialogDescription>
            Donnez votre avis sur {elementType === "ensemble" ? "cet ensemble" : "ce défi"}
          </DialogDescription>
        </DialogHeader>
        
        {error && (
          <Alert variant="destructive" className="mb-4 bg-red-100 text-red-900 border-red-200 dark:bg-red-900 dark:text-red-50 dark:border-red-800">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {/* Affichage du contenu de l'ensemble */}
        <div className="py-2 mb-4">
          <EnsembleContentDisplay
            ensemble={ensemble}
            loading={loading}
            error={error || ''}
            vetementsByType={vetementsByType}
          />
        </div>
        
        <div className="flex justify-center gap-6 py-4">
          <Button
            onClick={() => handleVoteInDialog("up")}
            disabled={isSubmitting}
            variant="outline"
            className={`p-6 rounded-full hover:bg-green-100 transition-colors ${
              userVote === 'up' ? 'bg-green-100 border-green-500' : ''
            }`}
            aria-label="J'aime"
          >
            {isSubmitting ? (
              <div className="animate-spin h-6 w-6 border-2 border-green-500 border-t-transparent rounded-full"></div>
            ) : (
              <ThumbsUp size={32} className={userVote === 'up' ? 'text-green-500' : 'text-gray-500'} />
            )}
          </Button>
          
          <Button
            onClick={() => handleVoteInDialog("down")}
            disabled={isSubmitting}
            variant="outline"
            className={`p-6 rounded-full hover:bg-red-100 transition-colors ${
              userVote === 'down' ? 'bg-red-100 border-red-500' : ''
            }`}
            aria-label="Je n'aime pas"
          >
            {isSubmitting ? (
              <div className="animate-spin h-6 w-6 border-2 border-red-500 border-t-transparent rounded-full"></div>
            ) : (
              <ThumbsDown size={32} className={userVote === 'down' ? 'text-red-500' : 'text-gray-500'} />
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VoterDialog;

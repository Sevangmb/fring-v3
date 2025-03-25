
import React, { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogClose
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { submitVote } from "@/services/votes/submitVote";
import { VoteType } from "@/services/votes/types";
import { useToast } from "@/hooks/use-toast";
import { getWinningEnsemble } from "@/services/votes/getWinningEnsemble";
import VotingForm from "./voting/VotingForm";
import ResultsDisplay from "./voting/ResultsDisplay";

interface VotingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ensembles: any[];
  onVoteSubmitted?: (ensembleId: number, vote: VoteType) => void;
  votedCount?: number;
  totalCount?: number;
  defiId: number;
}

const VotingDialog: React.FC<VotingDialogProps> = ({
  open,
  onOpenChange,
  ensembles,
  onVoteSubmitted,
  votedCount = 0,
  totalCount = 0,
  defiId
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showWinner, setShowWinner] = useState(false);
  const [winner, setWinner] = useState<any>(null);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allVoted, setAllVoted] = useState(false);
  const [votingResults, setVotingResults] = useState<{[key: number]: {id: number, name: string, upVotes: number, totalVotes: number}}>({});
  
  // Reset index when dialog opens
  useEffect(() => {
    if (open) {
      setCurrentIndex(0);
      setShowWinner(false);
      setAllVoted(false);
      setVotingResults({});
    }
  }, [open]);
  
  // When all ensembles are voted on, fetch the winner
  useEffect(() => {
    const fetchWinner = async () => {
      if (allVoted && defiId) {
        try {
          const winningEnsemble = await getWinningEnsemble(defiId);
          setWinner(winningEnsemble);
          setShowWinner(true);
        } catch (error) {
          console.error("Erreur lors de la récupération du gagnant:", error);
        }
      }
    };
    
    fetchWinner();
  }, [allVoted, defiId]);
  
  const currentEnsemble = ensembles[currentIndex];
  
  if (!currentEnsemble && !showWinner) {
    return null;
  }

  const handleVote = async (vote: VoteType) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      // Pour un vote pouce+, on compte le vote, pour pouce- on n'ajoute pas de point
      await submitVote('ensemble', currentEnsemble.id, vote);
      
      // Mettre à jour les résultats de vote (seulement pour les votes positifs)
      if (vote === 'up') {
        setVotingResults(prev => {
          const ensembleName = currentEnsemble.nom || "Ensemble sans nom";
          const currentVotes = prev[currentEnsemble.id] || { id: currentEnsemble.id, name: ensembleName, upVotes: 0, totalVotes: 0 };
          
          return {
            ...prev,
            [currentEnsemble.id]: {
              ...currentVotes,
              upVotes: currentVotes.upVotes + 1,
              totalVotes: currentVotes.totalVotes + 1
            }
          };
        });
      } else {
        // Pour les votes négatifs, on augmente juste le compteur total
        setVotingResults(prev => {
          const ensembleName = currentEnsemble.nom || "Ensemble sans nom";
          const currentVotes = prev[currentEnsemble.id] || { id: currentEnsemble.id, name: ensembleName, upVotes: 0, totalVotes: 0 };
          
          return {
            ...prev,
            [currentEnsemble.id]: {
              ...currentVotes,
              totalVotes: currentVotes.totalVotes + 1
            }
          };
        });
      }
      
      toast({
        title: "Vote enregistré !",
        description: `Vous avez ${vote === 'up' ? 'aimé' : 'disliké'} cet ensemble.`,
        variant: vote === 'up' ? "default" : "destructive",
      });
      
      if (onVoteSubmitted) {
        onVoteSubmitted(currentEnsemble.id, vote);
      }
      
      // Passer à l'ensemble suivant, sans fermer la fenêtre
      if (currentIndex < ensembles.length - 1) {
        setCurrentIndex(prevIndex => prevIndex + 1);
      } else {
        // Tous les ensembles ont été votés
        setAllVoted(true);
      }
    } catch (error) {
      console.error("Erreur lors du vote:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer votre vote. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-4 w-4" />
          <span className="sr-only">Fermer</span>
        </DialogClose>
        
        {showWinner ? (
          <ResultsDisplay 
            winner={winner} 
            votingResults={votingResults} 
            onClose={() => onOpenChange(false)} 
          />
        ) : (
          <VotingForm 
            currentEnsemble={currentEnsemble}
            currentIndex={currentIndex}
            totalEnsembles={ensembles.length}
            isSubmitting={isSubmitting}
            onVote={handleVote}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default VotingDialog;

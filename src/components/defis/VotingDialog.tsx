
import React, { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogClose
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ThumbsUp, ThumbsDown, X, Award, Check } from "lucide-react";
import { submitVote } from "@/services/votes/submitVote";
import { VoteType, EntityType } from "@/services/votes/types";
import { useToast } from "@/hooks/use-toast";
import { Text } from "@/components/atoms/Typography";
import { Progress } from "@/components/ui/progress";
import { getWinningEnsemble } from "@/services/votes/getWinningEnsemble";

interface VetementItemProps {
  name: string;
  brand: string;
  index: number;
}

const VetementItem: React.FC<VetementItemProps> = ({ name, brand, index }) => (
  <div className="mb-5">
    <div className="text-sm text-muted-foreground font-medium">{index}</div>
    <Card className="p-4 bg-card shadow-sm border-border/30">
      <div className="font-medium text-foreground">{name}</div>
      <div className="text-sm text-muted-foreground">{brand}</div>
    </Card>
  </div>
);

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
  
  // Reset index when dialog opens
  useEffect(() => {
    if (open) {
      setCurrentIndex(0);
      setShowWinner(false);
      setAllVoted(false);
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

  const progressPercentage = totalCount > 0 ? (votedCount / totalCount) * 100 : 0;
  
  const handleVote = async (vote: VoteType) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      // Pour un vote pouce-, on compte quand même le vote mais l'utilisateur n'ajoute pas de "point"
      await submitVote('ensemble', currentEnsemble.id, vote);
      
      toast({
        title: "Vote enregistré !",
        description: `Vous avez ${vote === 'up' ? 'aimé' : 'disliké'} cet ensemble.`,
        variant: vote === 'up' ? "default" : "destructive",
      });
      
      if (onVoteSubmitted) {
        onVoteSubmitted(currentEnsemble.id, vote);
      }
      
      // Move to next ensemble
      if (currentIndex < ensembles.length - 1) {
        setCurrentIndex(prevIndex => prevIndex + 1);
      } else {
        // All ensembles have been voted on
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

  // Render winner screen if all ensembles have been voted on
  if (showWinner) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Fermer</span>
          </DialogClose>
          
          <DialogHeader>
            <DialogTitle className="text-center text-primary">
              Votes terminés
            </DialogTitle>
            <DialogDescription className="text-center">
              Résultats du vote pour ce défi.
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-6 text-center space-y-4">
            {winner ? (
              <div className="space-y-4">
                <Award className="h-12 w-12 mx-auto text-yellow-500" />
                <h3 className="font-bold text-lg">Ensemble gagnant</h3>
                <div className="bg-primary/10 rounded-lg p-4">
                  <h4 className="font-semibold text-primary">{winner.ensembleName}</h4>
                  <p className="text-sm text-muted-foreground">Par {winner.userName}</p>
                  <div className="mt-2 flex items-center justify-center gap-3">
                    <span className="flex items-center text-green-500">
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      {winner.upVotes}
                    </span>
                    <span className="flex items-center text-red-500">
                      <ThumbsDown className="h-4 w-4 mr-1" />
                      {winner.downVotes}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                Aucun résultat disponible pour le moment.
              </div>
            )}
            
            <button
              onClick={() => onOpenChange(false)}
              className="mt-4 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
            >
              Fermer
            </button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  
  // Extract vetements from the ensemble
  const vetements = currentEnsemble.vetements || [];
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-4 w-4" />
          <span className="sr-only">Fermer</span>
        </DialogClose>
        
        <DialogHeader>
          <DialogTitle className="text-center text-primary">
            Voter pour {currentEnsemble.nom}
          </DialogTitle>
          <DialogDescription className="text-center">
            Donnez votre avis sur cet ensemble.
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-2 text-center">
          <h3 className="font-semibold text-lg">{currentEnsemble.nom}</h3>
          <Text variant="small" className="text-muted-foreground">
            {currentEnsemble.description}
          </Text>
        </div>

        {/* Progress bar for voting progress */}
        <div className="mt-2 mb-2">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>{votedCount} votés</span>
            <span>{totalCount} total</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
        
        <ScrollArea className="mt-4 max-h-60 rounded-md">
          {vetements.length > 0 ? (
            vetements.map((item: any, index: number) => (
              <VetementItem 
                key={item.id}
                name={item.vetement?.nom || "Vêtement sans nom"}
                brand={item.vetement?.marque || ""}
                index={index + 1}
              />
            ))
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              Cet ensemble ne contient aucun vêtement.
            </div>
          )}
        </ScrollArea>
        
        <div className="mt-6 flex justify-center space-x-4">
          <button
            onClick={() => handleVote('up')}
            disabled={isSubmitting}
            className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white rounded-md p-4 min-w-[5rem] transition-colors disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="animate-spin h-5 w-5 border-2 border-white border-opacity-50 border-t-transparent rounded-full"></div>
            ) : (
              <ThumbsUp className="h-6 w-6" />
            )}
          </button>
          
          <button
            onClick={() => handleVote('down')}
            disabled={isSubmitting}
            className="flex items-center justify-center bg-red-400 hover:bg-red-500 text-white rounded-md p-4 min-w-[5rem] transition-colors disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="animate-spin h-5 w-5 border-2 border-white border-opacity-50 border-t-transparent rounded-full"></div>
            ) : (
              <ThumbsDown className="h-6 w-6" />
            )}
          </button>
        </div>
        
        <div className="mt-2 text-center text-sm text-muted-foreground">
          {currentIndex + 1} sur {ensembles.length} ensembles
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VotingDialog;

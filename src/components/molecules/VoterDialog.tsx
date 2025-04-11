
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ThumbsUp, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { fetchEnsembleById } from "@/services/ensemble/fetchEnsembleById";
import { organizeVetementsByType } from "@/components/defis/voting/helpers/vetementOrganizer";
import EnsembleContentDisplay from "@/components/molecules/EnsembleContentDisplay";
import RedditStyleVoter from "@/components/molecules/RedditStyleVoter";

interface VoterDialogProps {
  elementId: number;
  elementType: "ensemble" | "defi";
  onVoteSubmitted?: (vote: "up" | "down" | null) => void;
  ensembleId?: number;
  onVoteUpdated?: () => Promise<void>;
}

const VoterDialog: React.FC<VoterDialogProps> = ({
  elementId,
  elementType,
  onVoteSubmitted,
  ensembleId,
  onVoteUpdated
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [ensemble, setEnsemble] = useState<any>(null);
  const [vetementsByType, setVetementsByType] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  const handleVoteChange = (vote: "up" | "down" | null) => {
    if (onVoteSubmitted) {
      onVoteSubmitted(vote);
    }
    
    // Call onVoteUpdated if it exists
    if (onVoteUpdated) {
      onVoteUpdated();
    }
    
    // Fermer le dialogue après le vote
    setIsOpen(false);
    
    // Afficher un message de confirmation
    if (vote) {
      toast({
        title: "Vote enregistré",
        description: vote === "up" ? "Vous aimez cet ensemble" : "Vous n'aimez pas cet ensemble",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
        >
          <ThumbsUp className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px]">
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 focus:outline-none">
          <X className="h-4 w-4" />
          <span className="sr-only">Fermer</span>
        </DialogClose>

        <DialogHeader>
          <DialogTitle>Voter pour {ensemble?.nom || 'cet ensemble'}</DialogTitle>
          <DialogDescription>
            Donnez votre avis sur cet ensemble
          </DialogDescription>
        </DialogHeader>
        
        {error && (
          <Alert variant="destructive" className="mb-4">
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
        
        <div className="flex justify-center py-4">
          <RedditStyleVoter
            entityType={elementType === "ensemble" ? "ensemble" : "tenue"}
            entityId={targetEnsembleId || 0}
            defiId={elementType === "defi" ? elementId : undefined}
            size="lg"
            onVoteChange={handleVoteChange}
            showScore={true}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VoterDialog;

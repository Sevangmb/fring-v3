
import React, { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogTitle,
  DialogHeader,
  DialogContentText,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ThumbsUp, X } from "lucide-react";
import { fetchEnsembleById } from "@/services/ensemble/fetchEnsembleById";
import { organizeVetementsByType } from "@/components/defis/voting/helpers/vetementOrganizer";
import EnsembleImages from "@/components/ensembles/EnsembleImages";
import VoteButtons from "@/components/defis/voting/VoteButtons";
import { useEntityVote } from "@/hooks/useEntityVote";
import { VetementType } from "@/services/meteo/tenue";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

interface VoteDefiDialogProps {
  defiId: number;
  defiTitle?: string;
  ensembleId: number;
}

const VoteDefiDialog: React.FC<VoteDefiDialogProps> = ({
  defiId,
  defiTitle,
  ensembleId
}) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [ensemble, setEnsemble] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [vetementsByType, setVetementsByType] = useState<Record<string, any[]>>({
    [VetementType.HAUT]: [],
    [VetementType.BAS]: [],
    [VetementType.CHAUSSURES]: [],
    'autre': []
  });

  const { userVote, votes, handleVote } = useEntityVote({
    entityType: "defi",
    entityId: ensembleId,
  });

  useEffect(() => {
    if (open && ensembleId) {
      loadEnsemble();
    }
  }, [open, ensembleId]);

  const loadEnsemble = async () => {
    if (!ensembleId) return;
    
    setLoading(true);
    setError(null);
    try {
      console.log("Chargement de l'ensemble:", ensembleId);
      const ensembleData = await fetchEnsembleById(ensembleId);
      console.log("Ensemble chargé:", ensembleData);
      
      if (!ensembleData) {
        throw new Error("Impossible de charger l'ensemble");
      }
      
      setEnsemble(ensembleData);
      
      if (ensembleData && ensembleData.vetements) {
        console.log("Organisation des vêtements de l'ensemble:", ensembleData.vetements);
        const organizedVetements = organizeVetementsByType(ensembleData);
        console.log("Vêtements organisés:", organizedVetements);
        setVetementsByType(organizedVetements);
      } else {
        console.error("L'ensemble n'a pas de vêtements ou format invalide:", ensembleData);
        setError("Aucun vêtement trouvé pour cet ensemble");
      }
    } catch (error) {
      console.error("Erreur lors du chargement de l'ensemble:", error);
      setError("Erreur lors du chargement de l'ensemble");
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setOpen(true);
    // Reset the error and ensemble states when opening the dialog
    setError(null);
    setEnsemble(null);
    setVetementsByType({
      [VetementType.HAUT]: [],
      [VetementType.BAS]: [],
      [VetementType.CHAUSSURES]: [],
      'autre': []
    });
  };
  
  const handleClose = () => setOpen(false);

  const onVote = (ensembleId: number, vote: 'up' | 'down') => {
    handleVote(vote).then(success => {
      if (success) {
        toast({
          title: "Vote enregistré",
          description: vote === 'up' ? "Vous aimez cet ensemble" : "Vous n'aimez pas cet ensemble",
          variant: vote === 'up' ? "default" : "destructive",
        });
        
        // Fermer le dialogue après le vote
        setTimeout(() => {
          handleClose();
        }, 500);
      } else {
        toast({
          title: "Erreur",
          description: "Impossible d'enregistrer votre vote",
          variant: "destructive",
        });
      }
    });
  };

  const renderEnsembleContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center my-4">
          <div className="grid grid-cols-3 gap-2 w-full max-w-md">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="text-center my-4 text-destructive">
          <p>{error}</p>
        </div>
      );
    }
    
    if (!ensemble) {
      return (
        <div className="text-center my-4">
          <p className="text-muted-foreground">Aucune information d'ensemble disponible</p>
        </div>
      );
    }
    
    return (
      <div className="text-center mb-3">
        <h3 className="text-lg font-medium mb-2">{ensemble.nom || "Ensemble sans nom"}</h3>
        
        <div className="flex justify-center items-center mb-3 p-2 bg-background/50 border border-input rounded-md min-h-[150px]">
          <EnsembleImages 
            vetementsByType={vetementsByType} 
            className="w-full max-w-md mx-auto"
          />
        </div>
        
        {ensemble.description && (
          <p className="text-sm text-muted-foreground mb-4">{ensemble.description}</p>
        )}
      </div>
    );
  };

  return (
    <>
      <Button 
        variant="outline" 
        size="sm"
        onClick={handleOpen}
        className="flex items-center gap-1 text-sm font-medium"
      >
        <ThumbsUp className="h-4 w-4" />
        <span>Voter</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              Voter pour {defiTitle || 'ce défi'}
              <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </DialogClose>
            </DialogTitle>
            <DialogContentText className="text-center text-muted-foreground">
              Donnez votre avis sur ce défi.
            </DialogContentText>
          </DialogHeader>
          
          {renderEnsembleContent()}
          
          <VoteButtons
            ensembleId={ensembleId}
            userVote={userVote}
            onVote={onVote}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VoteDefiDialog;

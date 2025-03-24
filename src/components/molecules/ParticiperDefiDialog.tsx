
import React, { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogClose 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Award } from "lucide-react";
import { participerDefi } from "@/services/defi/participationService";
import { fetchUserEnsembles } from "@/services/ensemble";
import { useToast } from "@/hooks/use-toast";
import EnsembleSelector from "./EnsembleSelector";

interface ParticiperDefiDialogProps {
  defiId: number;
  defiTitle?: string;
  onParticipation?: () => void;
}

const ParticiperDefiDialog: React.FC<ParticiperDefiDialogProps> = ({
  defiId,
  defiTitle,
  onParticipation
}) => {
  const [open, setOpen] = useState(false);
  const [ensembles, setEnsembles] = useState<any[]>([]);
  const [selectedEnsemble, setSelectedEnsemble] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const loadEnsembles = async () => {
    setLoading(true);
    try {
      const ensemblesData = await fetchUserEnsembles();
      
      if (ensemblesData.length === 0) {
        toast({
          title: "Aucun ensemble disponible",
          description: "Vous devez créer un ensemble avant de pouvoir participer",
          variant: "destructive"
        });
      }
      
      setEnsembles(ensemblesData);
    } catch (error) {
      console.error("Erreur lors du chargement des ensembles:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos ensembles",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      loadEnsembles();
    }
  };

  const handleEnsembleChange = (ensembleId: number) => {
    setSelectedEnsemble(ensembleId);
  };

  const handleSubmit = async () => {
    if (!selectedEnsemble) {
      toast({
        title: "Sélection requise",
        description: "Veuillez sélectionner un ensemble",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);
    try {
      const success = await participerDefi(defiId, selectedEnsemble);
      
      if (success) {
        toast({
          title: "Participation enregistrée",
          description: "Votre participation au défi a été enregistrée avec succès"
        });
        
        setOpen(false);
        
        if (onParticipation) {
          onParticipation();
        }
      } else {
        toast({
          title: "Erreur",
          description: "Impossible d'enregistrer votre participation",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Erreur lors de la participation:", error);
      const errorMessage = error instanceof Error ? error.message : "Une erreur est survenue";
      
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-1"
        onClick={() => handleOpenChange(true)}
      >
        <Award className="h-4 w-4" />
        <span>Participer</span>
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Participer au défi</DialogTitle>
            <DialogDescription>
              Choisissez un ensemble pour participer au défi "{defiTitle || `#${defiId}`}"
            </DialogDescription>
            <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </DialogHeader>

          <div className="py-4">
            <EnsembleSelector
              ensembles={ensembles}
              selectedEnsembleId={selectedEnsemble}
              onChange={handleEnsembleChange}
              loading={loading}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={submitting}
            >
              Annuler
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!selectedEnsemble || submitting}
              className="gap-1"
            >
              {submitting ? "Traitement en cours..." : "Participer"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ParticiperDefiDialog;


import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Award } from "lucide-react";
import { fetchEnsembles } from "@/services/ensemble";
import { participerDefi, checkUserParticipation } from "@/services/defi/participationService";
import EnsembleSelector from "@/components/molecules/EnsembleSelector";
import { Ensemble } from "@/services/ensemble/types";

interface ParticiperDefiDialogProps {
  defiId: number;
  defiTitle: string;
  onParticipation?: () => void;
}

const ParticiperDefiDialog: React.FC<ParticiperDefiDialogProps> = ({
  defiId,
  defiTitle,
  onParticipation
}) => {
  const [open, setOpen] = useState(false);
  const [ensembles, setEnsembles] = useState<Ensemble[]>([]);
  const [selectedEnsembleId, setSelectedEnsembleId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingEnsembles, setLoadingEnsembles] = useState(false);
  const [alreadyParticipating, setAlreadyParticipating] = useState(false);
  const { toast } = useToast();

  // Vérifier si l'utilisateur participe déjà
  useEffect(() => {
    const checkParticipation = async () => {
      setLoading(true);
      const isParticipating = await checkUserParticipation(defiId);
      setAlreadyParticipating(isParticipating);
      setLoading(false);
    };
    checkParticipation();
  }, [defiId]);

  // Charger les ensembles de l'utilisateur
  useEffect(() => {
    if (open) {
      const loadEnsembles = async () => {
        setLoadingEnsembles(true);
        try {
          const ensemblesData = await fetchEnsembles();
          setEnsembles(ensemblesData);
        } catch (error) {
          console.error("Erreur lors du chargement des ensembles:", error);
          toast({
            title: "Erreur",
            description: "Impossible de charger vos ensembles",
            variant: "destructive",
          });
        } finally {
          setLoadingEnsembles(false);
        }
      };
      loadEnsembles();
    }
  }, [open, toast]);

  const handleSelectEnsemble = (id: number) => {
    setSelectedEnsembleId(id);
  };

  const handleSubmit = async () => {
    if (!selectedEnsembleId) return;

    setLoading(true);
    try {
      const success = await participerDefi(defiId, selectedEnsembleId);
      if (success) {
        toast({
          title: "Participation enregistrée",
          description: "Votre ensemble a été soumis avec succès",
        });
        setOpen(false);
        setAlreadyParticipating(true);
        if (onParticipation) onParticipation();
      } else {
        toast({
          title: "Erreur",
          description: "Impossible d'enregistrer votre participation",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la participation:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {alreadyParticipating ? (
        <Button variant="outline" size="sm" className="ml-auto flex items-center gap-1" disabled>
          <Award className="h-3 w-3 mr-1" />
          Déjà participé
        </Button>
      ) : (
        <Button variant="default" size="sm" className="ml-auto" onClick={() => setOpen(true)}>
          Participer
        </Button>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Participer au défi : {defiTitle}</DialogTitle>
            <DialogDescription>
              Sélectionnez un ensemble de votre garde-robe pour participer à ce défi.
            </DialogDescription>
          </DialogHeader>

          {loadingEnsembles ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Chargement de vos ensembles...</span>
            </div>
          ) : ensembles.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                Vous n'avez pas encore créé d'ensembles.
              </p>
              <Button onClick={() => setOpen(false)} variant="outline">
                Créer un ensemble
              </Button>
            </div>
          ) : (
            <EnsembleSelector 
              ensembles={ensembles}
              selectedEnsembleId={selectedEnsembleId}
              onSelectEnsemble={handleSelectEnsemble}
            />
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Annuler
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={loading || !selectedEnsembleId}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Valider ma participation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ParticiperDefiDialog;

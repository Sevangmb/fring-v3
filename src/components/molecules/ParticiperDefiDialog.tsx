
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ChevronRight } from "lucide-react";
import { Ensemble } from "@/services/ensemble/types";
import { fetchEnsembles } from "@/services/ensemble/fetchEnsembles";
import { participerDefi, checkUserParticipation } from "@/services/defiService";
import { Card, CardContent } from "@/components/ui/card";
import EnsembleSelector from "./EnsembleSelector";
import { toast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { Text } from "@/components/atoms/Typography";

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
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userParticipation, setUserParticipation] = useState<{participe: boolean, ensembleId?: number}>({
    participe: false
  });

  // Charger les ensembles de l'utilisateur
  const loadEnsembles = async () => {
    try {
      setLoading(true);
      const data = await fetchEnsembles();
      setEnsembles(data);
      
      // Vérifier si l'utilisateur participe déjà
      const participation = await checkUserParticipation(defiId);
      setUserParticipation(participation);
      
      // Si l'utilisateur participe déjà, présélectionner son ensemble
      if (participation.participe && participation.ensembleId) {
        setSelectedEnsembleId(participation.ensembleId);
      }
    } catch (err) {
      console.error("Erreur lors du chargement des ensembles:", err);
      setError("Impossible de charger vos ensembles. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  // Charger les ensembles lorsque le dialogue s'ouvre
  useEffect(() => {
    if (open) {
      loadEnsembles();
    }
  }, [open, defiId]);

  // Gérer la soumission de la participation
  const handleSubmit = async () => {
    if (!selectedEnsembleId) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un ensemble pour participer",
        variant: "destructive"
      });
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      
      const success = await participerDefi(defiId, selectedEnsembleId);
      
      if (success) {
        setOpen(false);
        
        if (onParticipation) {
          onParticipation();
        }
      }
    } catch (err) {
      console.error("Erreur lors de la participation:", err);
      setError("Une erreur est survenue lors de l'enregistrement de votre participation. Veuillez réessayer.");
    } finally {
      setSubmitting(false);
    }
  };

  // Déterminer le texte du bouton en fonction de l'état de participation
  const buttonText = userParticipation.participe 
    ? "Modifier ma participation" 
    : "Participer";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          {buttonText} <ChevronRight className="h-3 w-3" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Participer au défi : {defiTitle}</DialogTitle>
          <DialogDescription>
            {userParticipation.participe
              ? "Vous participez déjà à ce défi. Vous pouvez modifier votre ensemble."
              : "Choisissez un ensemble parmi les vôtres pour participer à ce défi."}
          </DialogDescription>
        </DialogHeader>
        
        {error && (
          <Alert variant="destructive" className="my-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-4 py-4">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary/70" />
            </div>
          ) : ensembles.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Text className="text-center">
                  Vous n'avez pas encore créé d'ensembles. Veuillez créer un ensemble avant de participer.
                </Text>
                <Button 
                  className="mt-4" 
                  onClick={() => {
                    setOpen(false);
                    window.location.href = "/ensembles/ajouter";
                  }}
                >
                  Créer un ensemble
                </Button>
              </CardContent>
            </Card>
          ) : (
            <EnsembleSelector 
              ensembles={ensembles} 
              selectedEnsembleId={selectedEnsembleId}
              onSelectEnsemble={(id) => setSelectedEnsembleId(id)}
            />
          )}
        </div>
        
        <div className="flex justify-end gap-2 mt-4">
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)} 
            disabled={submitting}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={submitting || !selectedEnsembleId || loading || ensembles.length === 0}
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enregistrement...
              </>
            ) : userParticipation.participe ? "Mettre à jour" : "Participer"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ParticiperDefiDialog;

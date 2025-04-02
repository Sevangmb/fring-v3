
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchEnsembles } from "@/services/ensemble";
import { participerDefi, checkUserParticipation } from "@/services/defi/participationService";
import { Loader2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DefiParticipationFormProps {
  defiId: number;
  onParticipationUpdated?: () => void;
}

const DefiParticipationForm: React.FC<DefiParticipationFormProps> = ({ 
  defiId,
  onParticipationUpdated
}) => {
  const [ensembles, setEnsembles] = useState<any[]>([]);
  const [selectedEnsembleId, setSelectedEnsembleId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [participation, setParticipation] = useState<any>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Charger les ensembles de l'utilisateur
        const data = await fetchEnsembles();
        setEnsembles(data);
        
        // Vérifier si l'utilisateur a déjà participé
        const participationData = await checkUserParticipation(defiId);
        if (participationData.participe) {
          setParticipation(participationData);
          if (participationData.ensembleId) {
            setSelectedEnsembleId(participationData.ensembleId.toString());
          }
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger vos ensembles. Veuillez réessayer.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [defiId, toast]);
  
  const handleSubmit = async () => {
    if (!selectedEnsembleId) {
      toast({
        title: "Sélection requise",
        description: "Veuillez sélectionner un ensemble pour participer",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setSubmitting(true);
      const success = await participerDefi(defiId, parseInt(selectedEnsembleId));
      
      if (success) {
        toast({
          title: participation ? "Participation mise à jour" : "Participation enregistrée",
          description: participation 
            ? "Vous avez mis à jour votre participation avec succès" 
            : "Vous participez maintenant à ce défi"
        });
        
        setParticipation({ 
          participe: true, 
          ensembleId: parseInt(selectedEnsembleId) 
        });
        
        if (onParticipationUpdated) {
          onParticipationUpdated();
        }
      } else {
        toast({
          title: "Erreur",
          description: "Impossible d'enregistrer votre participation. Veuillez réessayer.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Erreur lors de la participation:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement de votre participation",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }
  
  if (ensembles.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="font-medium text-lg mb-2">Aucun ensemble disponible</h3>
            <p className="text-muted-foreground mb-4">
              Vous devez créer au moins un ensemble pour participer à ce défi
            </p>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Créer un ensemble
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="font-medium text-lg mb-4">
          {participation ? "Modifier ma participation" : "Participer à ce défi"}
        </h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ensemble">Sélectionnez un ensemble</Label>
            <Select
              value={selectedEnsembleId}
              onValueChange={setSelectedEnsembleId}
            >
              <SelectTrigger id="ensemble">
                <SelectValue placeholder="Choisir un ensemble" />
              </SelectTrigger>
              <SelectContent>
                {ensembles.map((ensemble) => (
                  <SelectItem key={ensemble.id} value={ensemble.id.toString()}>
                    {ensemble.nom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            onClick={handleSubmit} 
            disabled={submitting || !selectedEnsembleId}
            className="w-full"
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {participation ? "Mise à jour..." : "Participation..."}
              </>
            ) : (
              <>
                {participation ? "Mettre à jour ma participation" : "Participer au défi"}
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DefiParticipationForm;

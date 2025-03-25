
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2, User, Calendar } from "lucide-react";
import { getDefiParticipations, DefiParticipation } from "@/services/defi/participationService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { fetchEnsembleById } from "@/services/ensemble";
import { Ensemble } from "@/services/ensemble/types";

interface ParticipationsListProps {
  defiId: number;
}

const ParticipationsList: React.FC<ParticipationsListProps> = ({ defiId }) => {
  const { toast } = useToast();
  const [participations, setParticipations] = useState<DefiParticipation[]>([]);
  const [ensembles, setEnsembles] = useState<Record<number, Ensemble>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadParticipations = async () => {
      setLoading(true);
      try {
        const data = await getDefiParticipations(defiId);
        setParticipations(data);
        
        // Charger les ensembles associés
        const ensemblesData: Record<number, Ensemble> = {};
        for (const participation of data) {
          if (!ensemblesData[participation.ensemble_id]) {
            const ensemble = await fetchEnsembleById(participation.ensemble_id);
            if (ensemble) {
              ensemblesData[participation.ensemble_id] = ensemble;
            }
          }
        }
        setEnsembles(ensemblesData);
      } catch (error) {
        console.error("Erreur lors du chargement des participations:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les participations",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadParticipations();
  }, [defiId, toast]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Chargement des participations...</span>
      </div>
    );
  }

  if (participations.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          Aucune participation pour ce défi pour le moment.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {participations.map((participation) => {
        const ensemble = ensembles[participation.ensemble_id];
        
        return (
          <Card key={participation.id} className="overflow-hidden hover:shadow-md transition-all">
            <CardHeader className="bg-muted/20 p-4 border-b">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-base">Participant {participation.id}</CardTitle>
              </div>
              <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <Calendar className="h-3 w-3" />
                <span>
                  {format(new Date(participation.created_at), 'dd MMMM yyyy à HH:mm', { locale: fr })}
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              {ensemble ? (
                <div>
                  <p className="font-medium">{ensemble.nom}</p>
                  {ensemble.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {ensemble.description}
                    </p>
                  )}
                  
                  {/* Ici, on pourrait afficher une image de l'ensemble */}
                  
                  {participation.commentaire && (
                    <div className="mt-4 border-t pt-2">
                      <p className="text-sm italic">"{participation.commentaire}"</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground italic">
                  Détails de l'ensemble non disponibles
                </p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ParticipationsList;

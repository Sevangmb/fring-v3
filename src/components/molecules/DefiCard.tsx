
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/atoms/Typography";
import { Button } from "@/components/ui/button";
import { Award, Calendar, ChevronRight, Flag, Vote, Shirt } from "lucide-react";
import ParticiperDefiDialog from "./ParticiperDefiDialog";
import VoteDefiDialog from "./VoteDefiDialog";
import VoterDialog from "./VoterDialog";
import { Link } from "react-router-dom";
import { supabase } from '@/lib/supabase';
import { useToast } from "@/hooks/use-toast";
import { fetchEnsembleById } from "@/services/ensemble";

export type DefiType = "current" | "upcoming" | "past";

export interface DefiCardProps {
  id: number;
  title: string;
  description: string;
  dateRange: string;
  type: DefiType;
  icon?: React.ReactNode;
  participantsCount?: number;
  onParticipation?: () => void;
  ensembleId?: number; // Ensemble ID optionnel si un ensemble est lié au défi
}

const DefiCard: React.FC<DefiCardProps> = ({
  id,
  title,
  description,
  dateRange,
  type,
  icon = <Flag className="h-5 w-5" />,
  participantsCount = 0,
  onParticipation,
  ensembleId
}) => {
  const isPast = type === "past";
  const isUpcoming = type === "upcoming";
  const isCurrent = type === "current";
  const [validEnsembleId, setValidEnsembleId] = useState<number | undefined>(ensembleId);
  const [participation, setParticipation] = useState<any>(null);
  const [participantEnsembleId, setParticipantEnsembleId] = useState<number | null>(null);
  const [ensembleName, setEnsembleName] = useState<string | null>(null);
  const { toast } = useToast();

  // Récupérer la participation de l'utilisateur actuel s'il y en a une
  useEffect(() => {
    const fetchParticipation = async () => {
      try {
        // Vérifier si l'utilisateur actuel a participé à ce défi
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return;
        
        const { data, error } = await supabase
          .from('defi_participations')
          .select('id, ensemble_id')
          .eq('defi_id', id)
          .eq('user_id', session.user.id)
          .maybeSingle();
        
        if (error) throw error;
        
        if (data && data.ensemble_id) {
          console.log(`Participation trouvée: ${JSON.stringify(data)}`);
          setParticipation(data);
          setParticipantEnsembleId(data.ensemble_id);
          setValidEnsembleId(data.ensemble_id);
          
          // Récupérer les détails de l'ensemble pour afficher son nom
          try {
            const ensemble = await fetchEnsembleById(data.ensemble_id);
            if (ensemble) {
              setEnsembleName(ensemble.nom);
            }
          } catch (ensembleError) {
            console.error("Erreur lors de la récupération des détails de l'ensemble:", ensembleError);
          }
        } else {
          console.log(`Aucune participation trouvée pour le défi ${id}`);
        }
      } catch (err) {
        console.error("Erreur lors de la vérification de la participation:", err);
      }
    };

    if (isCurrent) {
      fetchParticipation();
    }
  }, [id, isCurrent]);

  return (
    <Card className={`overflow-hidden hover:shadow-md transition-all duration-300 ${isPast ? "opacity-80" : ""}`}>
      <CardHeader className={`${
        isUpcoming ? "bg-secondary/10" : isPast ? "bg-muted" : "bg-primary/10"
      } p-4 border-b flex items-center gap-2`}>
        {React.cloneElement(icon as React.ReactElement, {
          className: `h-5 w-5 ${isUpcoming ? "text-secondary" : isPast ? "" : "text-primary"}`
        })}
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <Text>{description}</Text>
        <div className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>{dateRange}</span>
        </div>
      </CardContent>
      <CardFooter className="border-t p-3 bg-muted/20">
        {isPast ? (
          <>
            <Text className="text-sm text-muted-foreground">
              <Award className="h-4 w-4 inline mr-1" />
              {participantsCount} participants
            </Text>
            <div className="ml-auto flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link to={`/defis/${id}/resultats`}>Voir les résultats</Link>
              </Button>
            </div>
          </>
        ) : isUpcoming ? (
          <Button variant="outline" size="sm" className="ml-auto flex items-center gap-1 opacity-70" disabled>
            Bientôt disponible <Calendar className="h-3 w-3" />
          </Button>
        ) : (
          <div className="flex w-full justify-between items-center">
            <Text className="text-sm text-muted-foreground">
              <Award className="h-4 w-4 inline mr-1" />
              {participantsCount} participants
            </Text>
            <div className="flex gap-2">
              {participation ? (
                <>
                  {ensembleName && (
                    <div className="flex items-center gap-1 text-sm text-primary">
                      <Shirt className="h-4 w-4" />
                      <span>{ensembleName}</span>
                    </div>
                  )}
                  <VoteDefiDialog 
                    defiId={id} 
                    defiTitle={title} 
                    ensembleId={participantEnsembleId || participation.ensemble_id}
                  />
                </>
              ) : (
                <ParticiperDefiDialog 
                  defiId={id} 
                  defiTitle={title} 
                  onParticipation={onParticipation}
                />
              )}
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default DefiCard;

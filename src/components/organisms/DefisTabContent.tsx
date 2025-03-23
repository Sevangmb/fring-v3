
import React, { useState, useEffect, useCallback } from "react";
import { PlusCircle, Flag, Calendar, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/atoms/Typography";
import DefiCard, { DefiType } from "@/components/molecules/DefiCard";
import CreateDefiDialog from "@/components/molecules/CreateDefiDialog";
import VoterDialog from "@/components/molecules/VoterDialog";
import { fetchDefis, Defi } from "@/services/defi";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface DefisTabContentProps {
  isLoading?: boolean;
}

const DefisTabContent: React.FC<DefisTabContentProps> = ({
  isLoading: externalLoading
}) => {
  const [defis, setDefis] = useState<Defi[]>([]);
  const [isLoading, setIsLoading] = useState(externalLoading || false);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const getDefiType = (defi: Defi): DefiType => {
    const now = new Date();
    const startDate = new Date(defi.date_debut);
    const endDate = new Date(defi.date_fin);
    if (endDate < now) return "past";
    if (startDate > now) return "upcoming";
    return "current";
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    return `Du ${format(new Date(startDate), 'dd MMM', {
      locale: fr
    })} au ${format(new Date(endDate), 'dd MMM yyyy', {
      locale: fr
    })}`;
  };

  const groupedDefis = defis.reduce((acc, defi) => {
    const type = getDefiType(defi);
    if (!acc[type]) acc[type] = [];
    acc[type].push(defi);
    return acc;
  }, {} as Record<DefiType, Defi[]>);

  const loadDefis = useCallback(async () => {
    if (!externalLoading) {
      setIsLoading(true);
    }
    try {
      const defisData = await fetchDefis();
      setDefis(defisData);
    } catch (error) {
      console.error("Erreur lors du chargement des défis:", error);
    } finally {
      if (!externalLoading) {
        setIsLoading(false);
      }
    }
  }, [externalLoading]);
  useEffect(() => {
    loadDefis();
  }, [loadDefis, refreshTrigger]);

  const handleDefiCreated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleParticipation = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleVoteSubmitted = (defiId: number, vote: "up" | "down") => {
    console.log(`Vote ${vote} pour défi #${defiId} enregistré`);
    setRefreshTrigger(prev => prev + 1);
  };

  return <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Défis de la communauté</h2>
          <Text className="text-muted-foreground">
            Participez aux défis de la communauté et montrez votre style
          </Text>
        </div>
        
        <div className="flex gap-2">
          <VoterDialog elementType="defi" />
          <CreateDefiDialog open={openCreateDialog} onOpenChange={setOpenCreateDialog} onDefiCreated={handleDefiCreated} />
        </div>
      </div>

      {isLoading ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="h-64 rounded-lg border border-border animate-pulse bg-muted/50" />)}
        </div> : <>
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Flag className="h-5 w-5 text-primary" />
              <h3 className="text-xl font-semibold">Défis en cours</h3>
            </div>
            {groupedDefis.current?.length ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groupedDefis.current.map(defi => (
                  <div key={defi.id} className="relative">
                    <DefiCard 
                      id={defi.id} 
                      title={defi.titre} 
                      description={defi.description} 
                      dateRange={formatDateRange(defi.date_debut, defi.date_fin)} 
                      type="current" 
                      participantsCount={defi.participants_count} 
                      onParticipation={handleParticipation}
                      ensembleId={defi.ensemble_id || defi.id} // Use ensemble_id if available, otherwise fallback to defi.id
                    />
                    <div className="absolute top-3 right-3">
                      <VoterDialog 
                        elementId={defi.id} 
                        elementType="defi"
                        onVoteSubmitted={(vote) => handleVoteSubmitted(defi.id, vote)}
                      />
                    </div>
                  </div>
                ))}
              </div> : <Text className="text-muted-foreground italic">
                Aucun défi en cours pour le moment
              </Text>}
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-5 w-5 text-secondary" />
              <h3 className="text-xl font-semibold">Défis à venir</h3>
            </div>
            {groupedDefis.upcoming?.length ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groupedDefis.upcoming.map(defi => (
                  <div key={defi.id} className="relative">
                    <DefiCard 
                      id={defi.id} 
                      title={defi.titre} 
                      description={defi.description} 
                      dateRange={formatDateRange(defi.date_debut, defi.date_fin)} 
                      type="upcoming" 
                      icon={<Calendar className="h-5 w-5" />}
                      ensembleId={defi.ensemble_id || defi.id} // Use ensemble_id if available, otherwise fallback to defi.id
                    />
                    <div className="absolute top-3 right-3">
                      <VoterDialog 
                        elementId={defi.id} 
                        elementType="defi"
                        onVoteSubmitted={(vote) => handleVoteSubmitted(defi.id, vote)}
                      />
                    </div>
                  </div>
                ))}
              </div> : <Text className="text-muted-foreground italic">
                Aucun défi à venir pour le moment
              </Text>}
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="h-5 w-5 text-muted-foreground" />
              <h3 className="text-xl font-semibold">Défis passés</h3>
            </div>
            {groupedDefis.past?.length ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groupedDefis.past.map(defi => (
                  <div key={defi.id} className="relative">
                    <DefiCard 
                      id={defi.id} 
                      title={defi.titre} 
                      description={defi.description} 
                      dateRange={formatDateRange(defi.date_debut, defi.date_fin)} 
                      type="past" 
                      icon={<Trophy className="h-5 w-5" />} 
                      participantsCount={defi.participants_count}
                      ensembleId={defi.ensemble_id || defi.id} // Use ensemble_id if available, otherwise fallback to defi.id
                    />
                    <div className="absolute top-3 right-3">
                      <VoterDialog 
                        elementId={defi.id} 
                        elementType="defi"
                        onVoteSubmitted={(vote) => handleVoteSubmitted(defi.id, vote)}
                      />
                    </div>
                  </div>
                ))}
              </div> : <Text className="text-muted-foreground italic">
                Aucun défi passé pour le moment
              </Text>}
          </section>
        </>}

      <CreateDefiDialog open={openCreateDialog} onOpenChange={setOpenCreateDialog} onDefiCreated={handleDefiCreated} />
    </div>;
};

export default DefisTabContent;

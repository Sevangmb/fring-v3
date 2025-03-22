
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FlameIcon, Clock, Trophy } from "lucide-react";
import DefiCard, { DefiType } from "@/components/molecules/DefiCard";
import DefiCardSkeleton from "@/components/molecules/DefiCardSkeleton";
import { getDefisByStatus, updateDefisStatus, Defi } from "@/services/defiService";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface DefisTabContentProps {
  isLoading?: boolean;
}

const DefisTabContent: React.FC<DefisTabContentProps> = ({ isLoading: initialLoading = false }) => {
  const [activeTab, setActiveTab] = useState("current");
  const [loading, setLoading] = useState(initialLoading);
  const [currentDefis, setCurrentDefis] = useState<Defi[]>([]);
  const [upcomingDefis, setUpcomingDefis] = useState<Defi[]>([]);
  const [pastDefis, setPastDefis] = useState<Defi[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const loadDefis = async () => {
    try {
      setLoading(true);
      
      // Mettre à jour le statut des défis en fonction des dates
      await updateDefisStatus();
      
      // Charger les défis par statut
      const [current, upcoming, past] = await Promise.all([
        getDefisByStatus('current'),
        getDefisByStatus('upcoming'),
        getDefisByStatus('past')
      ]);
      
      setCurrentDefis(current);
      setUpcomingDefis(upcoming);
      setPastDefis(past);
    } catch (error) {
      console.error("Erreur lors du chargement des défis:", error);
    } finally {
      setLoading(false);
    }
  };
  
  // Formater la plage de dates
  const formatDateRange = (startDate: string, endDate: string) => {
    const start = format(new Date(startDate), 'dd MMM', { locale: fr });
    const end = format(new Date(endDate), 'dd MMM', { locale: fr });
    return `${start} - ${end}`;
  };
  
  // Charger les défis au chargement du composant
  useEffect(() => {
    loadDefis();
  }, [refreshKey]);
  
  // Gérer la participation pour actualiser les compteurs
  const handleParticipation = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <Tabs defaultValue="current" value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid grid-cols-3 mb-6">
        <TabsTrigger value="current" className="flex items-center gap-2">
          <FlameIcon className="h-4 w-4" />
          <span>En cours</span>
        </TabsTrigger>
        <TabsTrigger value="upcoming" className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>À venir</span>
        </TabsTrigger>
        <TabsTrigger value="past" className="flex items-center gap-2">
          <Trophy className="h-4 w-4" />
          <span>Terminés</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="current" className="space-y-6">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, index) => (
              <DefiCardSkeleton key={index} />
            ))}
          </div>
        ) : currentDefis.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Aucun défi en cours pour le moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentDefis.map((defi) => (
              <DefiCard
                key={defi.id}
                id={defi.id}
                title={defi.titre}
                description={defi.description}
                dateRange={formatDateRange(defi.date_debut, defi.date_fin)}
                type="current"
                icon={<FlameIcon className="h-5 w-5" />}
                participantsCount={defi.participants_count}
                onParticipation={handleParticipation}
              />
            ))}
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="upcoming" className="space-y-6">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, index) => (
              <DefiCardSkeleton key={index} />
            ))}
          </div>
        ) : upcomingDefis.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Aucun défi à venir pour le moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingDefis.map((defi) => (
              <DefiCard
                key={defi.id}
                id={defi.id}
                title={defi.titre}
                description={defi.description}
                dateRange={formatDateRange(defi.date_debut, defi.date_fin)}
                type="upcoming"
                icon={<Clock className="h-5 w-5" />}
                participantsCount={defi.participants_count}
              />
            ))}
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="past" className="space-y-6">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, index) => (
              <DefiCardSkeleton key={index} />
            ))}
          </div>
        ) : pastDefis.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Aucun défi terminé pour le moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastDefis.map((defi) => (
              <DefiCard
                key={defi.id}
                id={defi.id}
                title={defi.titre}
                description={defi.description}
                dateRange={formatDateRange(defi.date_debut, defi.date_fin)}
                type="past"
                icon={<Trophy className="h-5 w-5" />}
                participantsCount={defi.participants_count}
              />
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default DefisTabContent;


import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DefiCard, { DefiType } from "../molecules/DefiCard";
import DefiCardSkeleton from "../molecules/DefiCardSkeleton";
import { Award, Calendar, Clock, Flag, Trophy } from "lucide-react";
import { getDefisByStatus, Defi, updateDefisStatus } from "@/services/defiService";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface DefisTabContentProps {
  isLoading?: boolean;
}

const DefisTabContent: React.FC<DefisTabContentProps> = ({ isLoading: initialLoading = false }) => {
  const [defisTab, setDefisTab] = useState<DefiType>("current");
  const [defis, setDefis] = useState<Defi[]>([]);
  const [isLoading, setIsLoading] = useState(initialLoading);
  
  const fetchDefis = async () => {
    setIsLoading(true);
    try {
      // D'abord, mettre à jour le statut des défis en fonction des dates
      await updateDefisStatus();
      
      // Ensuite, récupérer les défis en fonction de l'onglet actif
      const data = await getDefisByStatus(defisTab);
      setDefis(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des défis:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchDefis();
  }, [defisTab]);
  
  // Fonction pour formater l'affichage de la plage de dates
  const formatDateRange = (dateDebut: string, dateFin: string) => {
    const dateDebutObj = new Date(dateDebut);
    const dateFinObj = new Date(dateFin);
    
    const debutFormatted = format(dateDebutObj, 'd MMMM yyyy', { locale: fr });
    const finFormatted = format(dateFinObj, 'd MMMM yyyy', { locale: fr });
    
    return `${debutFormatted} - ${finFormatted}`;
  };
  
  // Fonction pour déterminer l'icône en fonction du titre du défi
  const getIconForDefi = (defi: Defi) => {
    const title = defi.titre.toLowerCase();
    
    if (title.includes('hebdomadaire') || title.includes('semaine')) {
      return <Flag className="h-5 w-5" />;
    } else if (title.includes('mensuel') || title.includes('mois')) {
      return <Award className="h-5 w-5" />;
    } else if (title.includes('saison') || title.includes('été') || title.includes('hiver') || title.includes('printemps') || title.includes('automne')) {
      return <Calendar className="h-5 w-5" />;
    } else {
      return <Trophy className="h-5 w-5" />;
    }
  };
  
  const renderLoadingSkeletons = () => {
    return Array(3).fill(0).map((_, index) => (
      <DefiCardSkeleton key={`skeleton-${index}`} />
    ));
  };
  
  const renderEmptyState = () => (
    <div className="text-center py-10">
      <Trophy className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
      <h3 className="text-lg font-medium mb-2">
        {defisTab === "current" ? "Aucun défi en cours" : 
         defisTab === "upcoming" ? "Aucun défi à venir" : "Aucun défi passé"}
      </h3>
      <p className="text-muted-foreground">
        {defisTab === "current" ? "Il n'y a pas de défis en cours pour le moment." : 
         defisTab === "upcoming" ? "Revenez plus tard pour découvrir les prochains défis." : 
         "Aucun défi passé n'a été trouvé."}
      </p>
    </div>
  );

  return (
    <Tabs value={defisTab} onValueChange={(value) => setDefisTab(value as DefiType)} className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-6">
        <TabsTrigger value="current" className="flex items-center gap-2">
          <Flag className="h-4 w-4" />
          <span>En cours</span>
        </TabsTrigger>
        <TabsTrigger value="upcoming" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>À venir</span>
        </TabsTrigger>
        <TabsTrigger value="past" className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>Passés</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value={defisTab} className="space-y-4">
        {isLoading ? (
          renderLoadingSkeletons()
        ) : defis.length === 0 ? (
          renderEmptyState()
        ) : (
          defis.map((defi) => (
            <DefiCard
              key={defi.id}
              title={defi.titre}
              description={defi.description}
              dateRange={formatDateRange(defi.date_debut, defi.date_fin)}
              type={defisTab as DefiType}
              icon={getIconForDefi(defi)}
              participantsCount={defi.participants_count}
            />
          ))
        )}
      </TabsContent>
    </Tabs>
  );
};

export default DefisTabContent;

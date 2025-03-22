
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DefiCard, { DefiType } from "../molecules/DefiCard";
import DefiCardSkeleton from "../molecules/DefiCardSkeleton";
import { Award, Calendar, Clock, Flag, Trophy } from "lucide-react";

// Define a common interface for all defi objects
interface DefiItem {
  title: string;
  description: string;
  dateRange: string;
  icon: React.ReactNode;
  type: DefiType;
  participantsCount?: number; // Make this property optional
}

interface DefisTabContentProps {
  isLoading?: boolean;
}

const DefisTabContent: React.FC<DefisTabContentProps> = ({ isLoading = false }) => {
  const [defisTab, setDefisTab] = useState<DefiType>("current");
  
  const currentDefis: DefiItem[] = [
    {
      title: "Défi hebdomadaire",
      description: "Créez un ensemble avec au moins un vêtement partagé par un ami.",
      dateRange: "15 juin - 22 juin 2024",
      icon: <Flag className="h-5 w-5" />,
      type: "current" as DefiType
    },
    {
      title: "Défi mensuel",
      description: "Partagez 5 vêtements et créez un ensemble complet pour chaque type de météo.",
      dateRange: "1 juin - 30 juin 2024",
      icon: <Award className="h-5 w-5" />,
      type: "current" as DefiType
    }
  ];

  const upcomingDefis: DefiItem[] = [
    {
      title: "Défi de la saison",
      description: "Créez votre meilleur ensemble d'été et partagez-le avec la communauté.",
      dateRange: "1 juillet - 31 août 2024",
      icon: <Calendar className="h-5 w-5" />,
      type: "upcoming" as DefiType
    },
    {
      title: "Challenge minimaliste",
      description: "Créez 10 ensembles différents en utilisant un maximum de 15 vêtements.",
      dateRange: "15 juillet - 15 août 2024",
      icon: <Trophy className="h-5 w-5" />,
      type: "upcoming" as DefiType
    }
  ];

  const pastDefis: DefiItem[] = [
    {
      title: "Challenge des tendances",
      description: "Créer un ensemble qui intègre au moins une tendance mode du printemps 2024.",
      dateRange: "1 avril - 30 avril 2024",
      icon: <Flag className="h-5 w-5" />,
      type: "past" as DefiType,
      participantsCount: 158
    },
    {
      title: "Défi des couleurs",
      description: "Créez des ensembles en utilisant uniquement des vêtements de trois couleurs maximum.",
      dateRange: "1 mars - 31 mars 2024",
      icon: <Flag className="h-5 w-5" />,
      type: "past" as DefiType,
      participantsCount: 127
    }
  ];

  const getDefisForTab = () => {
    if (defisTab === "current") return currentDefis;
    if (defisTab === "upcoming") return upcomingDefis;
    return pastDefis;
  };

  const renderLoadingSkeletons = () => {
    return Array(3).fill(0).map((_, index) => (
      <DefiCardSkeleton key={`skeleton-${index}`} />
    ));
  };

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
        ) : (
          getDefisForTab().map((defi, index) => (
            <DefiCard
              key={`${defisTab}-${index}`}
              title={defi.title}
              description={defi.description}
              dateRange={defi.dateRange}
              type={defi.type}
              icon={defi.icon}
              participantsCount={defi.participantsCount}
            />
          ))
        )}
      </TabsContent>
    </Tabs>
  );
};

export default DefisTabContent;

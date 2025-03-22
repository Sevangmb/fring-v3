
import React, { useEffect } from "react";
import { TabsContent } from "@/components/ui/tabs";
import VetementsList from "@/components/organisms/VetementsList";
import SearchFilterBar from "@/components/molecules/SearchFilterBar";
import { Categorie } from "@/services/categorieService";
import { Vetement } from "@/services/vetement/types";
import { Ami } from "@/services/amis/types";

interface MesVetementsTabProps {
  vetements: Vetement[];
  categories: Categorie[];
  marques: string[];
  acceptedFriends: Ami[];
  activeTab?: string;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  onVetementDeleted: (id: number) => void;
  onTabChange?: (tab: string) => void;
  hideTitle?: boolean;
}

const MesVetementsTab: React.FC<MesVetementsTabProps> = ({
  vetements,
  categories,
  marques,
  acceptedFriends,
  isLoading,
  error,
  isAuthenticated,
  onVetementDeleted,
  hideTitle = false,
}) => {
  // Loguer les données pour le débogage
  useEffect(() => {
    console.log('MesVetementsTab rendering with:', {
      vetements: vetements.length,
      categories: categories.length,
      marques: marques.length
    });
  }, [vetements, categories, marques]);

  return (
    <TabsContent value="mes-vetements">
      <SearchFilterBar />
      
      <VetementsList 
        vetements={vetements}
        isLoading={isLoading}
        error={error}
        isAuthenticated={isAuthenticated}
        onVetementDeleted={onVetementDeleted}
        showOwner={false}
        hideTitle={hideTitle}
      />
    </TabsContent>
  );
};

export default MesVetementsTab;

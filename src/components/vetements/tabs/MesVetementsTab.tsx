
import React, { useEffect } from "react";
import { TabsContent } from "@/components/ui/tabs";
import VetementsList from "@/components/organisms/VetementsList";
import CategoryTabs from "@/components/molecules/CategoryTabs";
import SearchFilterBar from "@/components/molecules/SearchFilterBar";
import { Categorie } from "@/services/categorieService";
import { Vetement } from "@/services/vetement/types";
import { Ami } from "@/services/amis/types";

interface MesVetementsTabProps {
  vetements: Vetement[];
  categories: Categorie[];
  marques: string[];
  acceptedFriends: Ami[];
  activeTab: string;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  onVetementDeleted: (id: number) => void;
  onTabChange: (tab: string) => void;
  hideTitle?: boolean;
}

const MesVetementsTab: React.FC<MesVetementsTabProps> = ({
  vetements,
  categories,
  marques,
  acceptedFriends,
  activeTab,
  isLoading,
  error,
  isAuthenticated,
  onVetementDeleted,
  onTabChange,
  hideTitle = false,
}) => {
  // Loguer les données pour le débogage
  useEffect(() => {
    console.log('MesVetementsTab rendering with:', {
      vetements: vetements.length,
      categories: categories.length,
      marques: marques.length,
      activeTab
    });
  }, [vetements, categories, marques, activeTab]);

  return (
    <TabsContent value="mes-vetements">
      <SearchFilterBar />
      
      <CategoryTabs 
        categories={categories}
        activeTab={activeTab}
        onTabChange={onTabChange}
      >
        <VetementsList 
          vetements={vetements}
          isLoading={isLoading}
          error={error}
          isAuthenticated={isAuthenticated}
          onVetementDeleted={onVetementDeleted}
          showOwner={false}
          hideTitle={hideTitle}
        />
      </CategoryTabs>
    </TabsContent>
  );
};

export default MesVetementsTab;

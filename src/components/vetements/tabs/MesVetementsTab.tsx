
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import VetementsList from "@/components/organisms/VetementsList";
import CategoryTabs from "@/components/molecules/CategoryTabs";
import { SearchFilterProvider } from "@/contexts/SearchFilterContext";
import SearchFilterBar from "@/components/molecules/SearchFilterBar";
import { Categorie } from "@/services/categorieService";
import { Vetement } from "@/services/vetement/types";
import { Ami } from "@/services/amis/types";

interface MesVetementsTabProps {
  vetements: Vetement[];
  categories: Categorie[];
  marques: string[]; // Changed from Marque[] to string[]
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
  return (
    <TabsContent value="mes-vetements">
      <SearchFilterProvider
        categories={categories}
        marques={marques}
        friends={acceptedFriends}
        showFriendFilter={false}
      >
        <SearchFilterBar />
      </SearchFilterProvider>
      
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

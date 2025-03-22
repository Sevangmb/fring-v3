
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import VetementsList from "@/components/organisms/VetementsList";
import CategoryTabs from "@/components/molecules/CategoryTabs";
import { SearchFilterProvider } from "@/contexts/SearchFilterContext";
import SearchFilterBar from "@/components/molecules/SearchFilterBar";
import { Categorie } from "@/services/categorieService";
import { Vetement } from "@/services/vetement/types";
import { Ami } from "@/services/amis/types";

interface VetementsAmisTabProps {
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
}

const VetementsAmisTab: React.FC<VetementsAmisTabProps> = ({
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
}) => {
  return (
    <TabsContent value="vetements-amis">
      <SearchFilterProvider
        categories={categories}
        marques={marques}
        friends={acceptedFriends}
        showFriendFilter={true}
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
          showOwner={true}
        />
      </CategoryTabs>
    </TabsContent>
  );
};

export default VetementsAmisTab;

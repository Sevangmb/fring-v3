
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import VetementsList from "@/components/organisms/VetementsList";
import SearchFilterBar from "@/components/molecules/SearchFilterBar";
import { Categorie } from "@/services/categorieService";
import { Vetement } from "@/services/vetement/types";
import { Ami } from "@/services/amis/types";
import { SearchFilterProvider, useSearchFilter } from "@/contexts/SearchFilterContext";

interface VetementsAmisTabProps {
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
  description?: string;
}

/**
 * Onglet pour afficher les vêtements des amis
 */
const VetementsAmisTab: React.FC<VetementsAmisTabProps> = ({
  vetements,
  categories,
  marques,
  acceptedFriends,
  isLoading,
  error,
  isAuthenticated,
  onVetementDeleted,
  description,
}) => {
  return (
    <TabsContent value="vetements-amis">
      {description && (
        <p className="text-muted-foreground mb-4">{description}</p>
      )}
      
      {/* Wrap the content in SearchFilterProvider */}
      <SearchFilterProvider
        categories={categories}
        marques={marques}
        friends={acceptedFriends}
        showFriendFilter={true}
      >
        <VetementsAmisTabContent 
          vetements={vetements}
          isLoading={isLoading}
          error={error}
          isAuthenticated={isAuthenticated}
          onVetementDeleted={onVetementDeleted}
        />
      </SearchFilterProvider>
    </TabsContent>
  );
};

// Create a separate component to use the context after it's provided
const VetementsAmisTabContent: React.FC<{
  vetements: Vetement[];
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  onVetementDeleted: (id: number) => void;
}> = ({ vetements, isLoading, error, isAuthenticated, onVetementDeleted }) => {
  // Now we can safely use the context because we're inside the provider
  const { searchTerm, categorieFilter, marqueFilter } = useSearchFilter();
  
  return (
    <>
      <SearchFilterBar />
      
      <VetementsList 
        vetements={vetements}
        isLoading={isLoading}
        error={error}
        isAuthenticated={isAuthenticated}
        onVetementDeleted={onVetementDeleted}
        showOwner={true}
      />
    </>
  );
};

export default VetementsAmisTab;

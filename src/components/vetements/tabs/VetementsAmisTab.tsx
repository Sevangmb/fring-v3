
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import VetementsList from "@/components/organisms/VetementsList";
import SearchFilterBar from "@/components/molecules/SearchFilterBar";
import { Categorie } from "@/services/categorieService";
import { Vetement } from "@/services/vetement/types";
import { Ami } from "@/services/amis/types";
import { useSearchFilter } from "@/contexts/SearchFilterContext";

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
  // Nous utilisons le contexte pour accéder aux filtres
  const { searchTerm, categorieFilter, marqueFilter } = useSearchFilter();

  return (
    <TabsContent value="vetements-amis">
      {description && (
        <p className="text-muted-foreground mb-4">{description}</p>
      )}
      
      <SearchFilterBar />
      
      <VetementsList 
        vetements={vetements}
        isLoading={isLoading}
        error={error}
        isAuthenticated={isAuthenticated}
        onVetementDeleted={onVetementDeleted}
        showOwner={true}
      />
    </TabsContent>
  );
};

export default VetementsAmisTab;

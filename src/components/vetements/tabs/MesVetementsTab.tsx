import React, { useEffect } from "react";
import VetementCard from "@/components/molecules/VetementCard";
import { useAuth } from "@/contexts/AuthContext";
import { Vetement } from "@/services/vetement/types";
import { deleteVetement } from "@/services/vetement";
import { Categorie } from "@/services/categorieService";
import { useToast } from "@/hooks/use-toast";
import SearchFilterBar from "@/components/molecules/SearchFilterBar";
import { SearchFilterProvider } from "@/contexts/SearchFilterContext";
import { useCategories } from "@/hooks/useCategories";

interface MesVetementsTabProps {
  vetements: Vetement[];
  categories: Categorie[];
  marques: any[];
  acceptedFriends?: any[];
  activeTab?: string;
  isLoading?: boolean;
  error?: string | null;
  isAuthenticated?: boolean;
  onVetementDeleted?: (id: number) => void;
  onTabChange?: (value: string) => void;
  hideTitle?: boolean;
}

const MesVetementsTab: React.FC<MesVetementsTabProps> = ({
  vetements,
  marques,
  acceptedFriends = [],
  activeTab,
  isLoading = false,
  error = null,
  isAuthenticated = false,
  onVetementDeleted,
  onTabChange,
  hideTitle = false
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const { categories, loadingCategories } = useCategories();
  
  useEffect(() => {
    console.log("Catégories reçues dans MesVetementsTab:", categories);
  }, [categories]);

  const handleDeleteVetement = async (id: number) => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour supprimer un vêtement",
        variant: "destructive",
      });
      return;
    }

    try {
      await deleteVetement(id);
      toast({
        title: "Succès",
        description: "Le vêtement a été supprimé avec succès",
      });
      
      if (onVetementDeleted) {
        onVetementDeleted(id);
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le vêtement",
        variant: "destructive",
      });
      console.error("Erreur lors de la suppression du vêtement:", error);
    }
  };

  if (isLoading || loadingCategories) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="h-8 w-8 animate-spin text-primary border-2 border-current border-t-transparent rounded-full" />
        <span className="ml-2">Chargement des vêtements...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-10 text-center">
        <p className="text-destructive mb-2">Erreur lors du chargement des vêtements</p>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="py-10 text-center">
        <p className="text-lg font-medium mb-2">Vous devez être connecté pour voir vos vêtements</p>
        <p className="text-muted-foreground">Connectez-vous pour accéder à votre garde-robe</p>
      </div>
    );
  }

  if (vetements.length === 0) {
    return (
      <div className="py-10 text-center">
        <p className="text-lg font-medium mb-2">Aucun vêtement trouvé</p>
        <p className="text-muted-foreground">Ajoutez des vêtements à votre garde-robe</p>
      </div>
    );
  }

  return (
    <div>
      <SearchFilterProvider 
        categories={categories || []}
        marques={marques}
        friends={acceptedFriends}
        showFriendFilter={false}
      >
        <SearchFilterBar />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {vetements.map((vetement) => (
            <VetementCard 
              key={vetement.id}
              vetement={vetement}
              onDelete={handleDeleteVetement}
            />
          ))}
        </div>
      </SearchFilterProvider>
    </div>
  );
};

export default MesVetementsTab;

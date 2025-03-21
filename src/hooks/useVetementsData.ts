
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { fetchVetements, fetchVetementsAmis, Vetement } from "@/services/vetement";
import { fetchCategories, Categorie } from "@/services/categorieService";
import { fetchMarques, Marque } from "@/services/marqueService";
import { Ami } from "@/services/amis";

export interface VetementsDataState {
  vetements: Vetement[];
  categories: Categorie[];
  marques: Marque[];
  isLoading: boolean;
  error: string | null;
}

export function useVetementsData(
  viewMode: 'mes-vetements' | 'vetements-amis',
  friendFilter: string
) {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [state, setState] = useState<VetementsDataState>({
    vetements: [],
    categories: [],
    marques: [],
    isLoading: true,
    error: null
  });
  const [selectedFriendEmail, setSelectedFriendEmail] = useState<string | undefined>(undefined);

  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        setState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      try {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        
        console.log("Chargement des données pour l'utilisateur:", user.id);
        
        const [categoriesData, marquesData] = await Promise.all([
          fetchCategories(),
          fetchMarques()
        ]);
        
        let vetementsData: Vetement[] = [];
        if (viewMode === 'mes-vetements') {
          vetementsData = await fetchVetements();
        } else {
          const friendIdParam = friendFilter !== "all" ? friendFilter : undefined;
          vetementsData = await fetchVetementsAmis(friendIdParam);
        }
        
        console.log("Vêtements récupérés:", vetementsData.length);
        console.log("Catégories récupérées:", categoriesData.length);
        console.log("Marques récupérées:", marquesData.length);
        
        setState({
          vetements: vetementsData,
          categories: categoriesData,
          marques: marquesData,
          isLoading: false,
          error: null
        });
      } catch (err) {
        console.error("Erreur lors de la récupération des données:", err);
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: "Impossible de charger les données. Veuillez réessayer."
        }));
        toast({
          title: "Erreur",
          description: "Impossible de charger les données.",
          variant: "destructive",
        });
      }
    };
    
    if (!authLoading) {
      loadData();
    }
  }, [user, authLoading, toast, viewMode, friendFilter]);

  return {
    ...state,
    selectedFriendEmail,
    setSelectedFriendEmail
  };
}

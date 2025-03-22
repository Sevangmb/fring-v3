
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { useFavoris } from "@/hooks/useFavoris";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { FavoriWithDetails } from "@/services/favoris/types";
import FavorisTypeFilter from "@/components/favoris/FavorisTypeFilter";
import FavorisList from "@/components/favoris/FavorisList";

const MesFavorisTab: React.FC = () => {
  const { favoris, loading, retirerFavori, loadFavoris } = useFavoris();
  const [activeTab, setActiveTab] = useState<string>("all");
  const navigate = useNavigate();
  const { toast } = useToast();

  // Filtrer les favoris selon l'onglet actif
  const filteredFavoris = React.useMemo(() => {
    if (activeTab === "all") return favoris;
    return favoris.filter(f => f.type_favori === activeTab);
  }, [favoris, activeTab]);

  // Gérer la navigation lors du clic sur un favori
  const handleFavoriClick = (favori: FavoriWithDetails) => {
    if (!isElementAvailable(favori)) return; // Ne pas naviguer si l'élément a été supprimé

    if (favori.type_favori === 'vetement') {
      navigate(`/mes-vetements/modifier/${favori.element_id}`);
    } else if (favori.type_favori === 'ensemble') {
      navigate(`/ensembles/modifier/${favori.element_id}`);
    } else if (favori.type_favori === 'utilisateur') {
      navigate(`/messages/${favori.element_id}`);
    }
  };

  // Gérer la suppression d'un favori
  const handleRemoveFavori = async (e: React.MouseEvent, favori: FavoriWithDetails) => {
    e.stopPropagation(); // Empêcher la navigation

    try {
      await retirerFavori(favori.type_favori, favori.element_id);
      toast({
        title: "Favori supprimé",
        description: "L'élément a été retiré de vos favoris.",
        variant: "default",
      });
      loadFavoris(); // Rafraîchir la liste après suppression
    } catch (error) {
      console.error("Erreur lors de la suppression du favori:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer ce favori.",
        variant: "destructive",
      });
    }
  };

  // Fonction pour déterminer si un élément est réellement disponible
  const isElementAvailable = (favori: FavoriWithDetails) => {
    // Vérifier que details n'est pas null/undefined et contient des données
    return favori.details !== null && 
           favori.details !== undefined && 
           Object.keys(favori.details).length > 0;
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <Tabs defaultValue="all" className="w-full" value={activeTab}>
          <FavorisTypeFilter activeTab={activeTab} onTabChange={handleTabChange} />
          
          <FavorisList 
            favoris={filteredFavoris}
            loading={loading}
            onRemoveFavori={handleRemoveFavori}
            onFavoriClick={handleFavoriClick}
            activeType={activeTab}
          />
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MesFavorisTab;

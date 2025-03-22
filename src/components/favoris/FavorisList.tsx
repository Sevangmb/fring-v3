
import React from "react";
import { FavoriWithDetails } from "@/services/favoris/types";
import { Loader2 } from "lucide-react";
import FavoriItem from "./FavoriItem";

interface FavorisListProps {
  favoris: FavoriWithDetails[];
  loading: boolean;
  onRemoveFavori: (e: React.MouseEvent, favori: FavoriWithDetails) => Promise<void>;
  onFavoriClick: (favori: FavoriWithDetails) => void;
  activeType: string;
}

const FavorisList: React.FC<FavorisListProps> = ({ 
  favoris, 
  loading, 
  onRemoveFavori, 
  onFavoriClick,
  activeType
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Chargement des favoris...</span>
      </div>
    );
  }

  if (favoris.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-2">
          Vous n'avez pas encore de favoris{activeType !== "all" ? ` de type ${activeType}` : ""}.
        </p>
        <p className="text-sm">
          Vous pouvez ajouter des éléments en favoris en cliquant sur l'icône ❤️ dans les listes.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {favoris.map((favori) => (
        <FavoriItem 
          key={favori.id}
          favori={favori} 
          onRemove={onRemoveFavori} 
          onClick={onFavoriClick}
        />
      ))}
    </div>
  );
};

export default FavorisList;

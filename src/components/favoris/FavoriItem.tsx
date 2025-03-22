
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Trash2 } from "lucide-react";
import { FavoriWithDetails } from "@/services/favoris/types";

interface FavoriItemProps {
  favori: FavoriWithDetails;
  onRemove: (e: React.MouseEvent, favori: FavoriWithDetails) => Promise<void>;
  onClick: (favori: FavoriWithDetails) => void;
}

const FavoriItem: React.FC<FavoriItemProps> = ({ favori, onRemove, onClick }) => {
  // Fonction pour déterminer si un élément est réellement disponible
  const isElementAvailable = (favori: FavoriWithDetails) => {
    return favori.details !== null && 
           favori.details !== undefined && 
           Object.keys(favori.details).length > 0;
  };

  const elementAvailable = isElementAvailable(favori);
  
  return (
    <Card 
      key={favori.id} 
      className={`overflow-hidden transition-shadow ${elementAvailable ? 'cursor-pointer hover:shadow-md' : 'bg-muted/30'}`}
      onClick={() => onClick(favori)}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Badge variant={
              favori.type_favori === 'vetement' 
                ? 'default' 
                : favori.type_favori === 'ensemble' 
                  ? 'secondary' 
                  : 'outline'
            }>
              {favori.type_favori}
            </Badge>
          </div>
          <span className="text-xs text-muted-foreground">
            ID: {favori.element_id}
          </span>
        </div>
        
        {!elementAvailable ? (
          <div className="mt-2 bg-muted/50 p-4 rounded-md">
            <div className="flex items-center space-x-2 text-muted-foreground mb-2">
              <AlertTriangle size={16} className="text-amber-500" />
              <h3 className="font-medium">
                {favori.type_favori === 'vetement' ? 'Vêtement supprimé' : 
                 favori.type_favori === 'ensemble' ? 'Ensemble supprimé' : 
                 'Utilisateur indisponible'}
              </h3>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Élément supprimé ou indisponible
            </p>
            <Button 
              variant="outline" 
              size="sm"
              className="w-full flex items-center justify-center gap-2 mt-2"
              onClick={(e) => onRemove(e, favori)}
            >
              <Trash2 size={14} />
              <span>Retirer des favoris</span>
            </Button>
          </div>
        ) : (
          <>
            <h3 className="font-medium mt-2 line-clamp-1">{favori.nom || "Sans nom"}</h3>
            
            <div className="mt-2 text-sm text-muted-foreground">
              {favori.type_favori === 'vetement' && (
                <div className="flex flex-col">
                  <span>Couleur: {favori.details.couleur}</span>
                  <span>Taille: {favori.details.taille}</span>
                </div>
              )}
              {favori.type_favori === 'ensemble' && (
                <span>{favori.details.description || `Ensemble avec ${favori.details.vetements?.length || 0} vêtements`}</span>
              )}
              {favori.type_favori === 'utilisateur' && (
                <span>{favori.details.email}</span>
              )}
            </div>
            
            <div className="mt-3 flex justify-end">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-destructive hover:text-destructive/90 p-0 h-auto"
                onClick={(e) => onRemove(e, favori)}
              >
                <Trash2 size={14} className="mr-1" />
                <span className="text-xs">Retirer</span>
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default FavoriItem;

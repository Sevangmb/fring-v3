
import React from 'react';
import { Vetement } from '@/services/vetement/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface VetementCarouselItemProps {
  vetement: Vetement;
  isSelected: boolean;
  onSelect: () => void;
}

const VetementCarouselItem: React.FC<VetementCarouselItemProps> = ({
  vetement,
  isSelected,
  onSelect
}) => {
  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all border-2", 
        isSelected 
          ? "border-primary shadow-lg scale-105" 
          : "border-transparent hover:border-primary/50"
      )}
      onClick={onSelect}
    >
      <CardContent className="p-4 flex flex-col items-center">
        <div className="w-full aspect-square mb-4 relative">
          {isSelected && (
            <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
              Sélectionné
            </Badge>
          )}
          
          {vetement.image_url ? (
            <img 
              src={vetement.image_url} 
              alt={vetement.nom} 
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted rounded-md">
              <p className="text-muted-foreground text-xs">Pas d'image</p>
            </div>
          )}
        </div>
        
        <div className="text-center space-y-1">
          <h4 className="font-medium text-sm truncate max-w-full">
            {vetement.nom}
          </h4>
          <p className="text-xs text-muted-foreground truncate max-w-full">
            {vetement.marque || "Sans marque"} • {vetement.couleur}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default VetementCarouselItem;

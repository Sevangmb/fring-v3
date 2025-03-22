
import React from 'react';
import { Vetement } from '@/services/vetement/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface VetementCarouselItemProps {
  vetement: Vetement;
  isSelected: boolean;
  onSelect: () => void;
  compact?: boolean;
}

const VetementCarouselItem: React.FC<VetementCarouselItemProps> = ({
  vetement,
  isSelected,
  onSelect,
  compact = false
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
      <CardContent className={cn(
        "flex flex-col items-center",
        compact ? "p-2" : "p-4"
      )}>
        <div className={cn(
          "w-full relative mb-2",
          compact ? "aspect-square max-h-24" : "aspect-square"
        )}>
          {isSelected && (
            <Badge className="absolute top-1 right-1 bg-primary text-primary-foreground text-xs py-0">
              ✓
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
        
        <div className="text-center space-y-0.5 w-full">
          <h4 className={cn(
            "font-medium truncate max-w-full",
            compact ? "text-xs" : "text-sm"
          )}>
            {vetement.nom}
          </h4>
          {!compact && (
            <p className="text-xs text-muted-foreground truncate max-w-full">
              {vetement.marque || "Sans marque"} • {vetement.couleur}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VetementCarouselItem;

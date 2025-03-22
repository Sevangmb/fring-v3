
import React from 'react';
import { Vetement } from '@/services/vetement/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

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
        "cursor-pointer transition-all border-2 hover:shadow-md overflow-hidden group",
        isSelected 
          ? "border-primary shadow-md ring-2 ring-primary/20" 
          : "border-transparent hover:border-primary/50"
      )}
      onClick={onSelect}
    >
      <CardContent className={cn(
        "flex flex-col items-center relative",
        compact ? "p-2" : "p-3"
      )}>
        {isSelected && (
          <div className="absolute top-1 right-1 z-10 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center">
            <Check className="h-3 w-3" />
          </div>
        )}
        
        <div className={cn(
          "w-full relative mb-2 overflow-hidden rounded-md",
          compact ? "aspect-square max-h-20" : "aspect-square"
        )}>
          {vetement.image_url ? (
            <div className="relative w-full h-full group-hover:scale-105 transition-transform duration-300">
              <img 
                src={vetement.image_url} 
                alt={vetement.nom} 
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted rounded-md">
              <p className="text-muted-foreground text-xs">Pas d'image</p>
            </div>
          )}
        </div>
        
        <div className="text-center space-y-1 w-full">
          <h4 className={cn(
            "font-medium truncate max-w-full",
            compact ? "text-xs" : "text-sm"
          )}>
            {vetement.nom}
          </h4>
          {!compact && (
            <div className="flex flex-wrap justify-center gap-1 mt-1">
              {vetement.marque && (
                <Badge variant="secondary" className="text-xs font-normal">
                  {vetement.marque}
                </Badge>
              )}
              <Badge variant="outline" className="text-xs font-normal">
                {vetement.couleur}
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VetementCarouselItem;

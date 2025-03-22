
import React, { useState, useEffect } from 'react';
import { Vetement } from '@/services/vetement/types';
import { VetementType } from '@/services/meteo/tenue';
import { determinerTypeVetement } from '@/services/meteo/tenue';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import VetementCarouselItem from './VetementCarouselItem';
import { Shirt, ShoppingBag, Footprints } from 'lucide-react';

interface EnsembleCreatorProps {
  vetements: Vetement[];
  selectedItems: {
    haut: Vetement | null;
    bas: Vetement | null;
    chaussures: Vetement | null;
  };
  onItemsSelected: (items: {
    haut: Vetement | null;
    bas: Vetement | null;
    chaussures: Vetement | null;
  }) => void;
}

const EnsembleCreator: React.FC<EnsembleCreatorProps> = ({ 
  vetements, 
  selectedItems, 
  onItemsSelected 
}) => {
  const [categorizedVetements, setCategorizedVetements] = useState<{
    hauts: Vetement[];
    bas: Vetement[];
    chaussures: Vetement[];
  }>({
    hauts: [],
    bas: [],
    chaussures: []
  });

  useEffect(() => {
    const categorizeVetements = async () => {
      const hauts: Vetement[] = [];
      const bas: Vetement[] = [];
      const chaussures: Vetement[] = [];

      for (const vetement of vetements) {
        const type = await determinerTypeVetement(vetement);
        
        if (type === VetementType.HAUT) {
          hauts.push(vetement);
        } else if (type === VetementType.BAS) {
          bas.push(vetement);
        } else if (type === VetementType.CHAUSSURES) {
          chaussures.push(vetement);
        }
      }

      setCategorizedVetements({ hauts, bas, chaussures });
      
      if (hauts.length > 0 && !selectedItems.haut) {
        handleSelectItem('haut', hauts[0]);
      }
      
      if (bas.length > 0 && !selectedItems.bas) {
        handleSelectItem('bas', bas[0]);
      }
      
      if (chaussures.length > 0 && !selectedItems.chaussures) {
        handleSelectItem('chaussures', chaussures[0]);
      }
    };

    categorizeVetements();
  }, [vetements]);

  const handleSelectItem = (type: 'haut' | 'bas' | 'chaussures', item: Vetement) => {
    onItemsSelected({
      ...selectedItems,
      [type]: item
    });
  };

  const renderCarousel = (
    items: Vetement[], 
    type: 'haut' | 'bas' | 'chaussures', 
    icon: React.ReactNode, 
    label: string
  ) => {
    const isSelected = selectedItems[type]?.id;
    
    return (
      <div className="space-y-1">
        <div className="flex items-center gap-1 border-b pb-1">
          {icon}
          <h3 className="text-xs font-medium">{label} ({items.length})</h3>
        </div>
        
        {items.length === 0 ? (
          <div className="text-center py-1 bg-muted/30 rounded-lg">
            <p className="text-xs text-muted-foreground">Aucun {label.toLowerCase()} disponible</p>
          </div>
        ) : (
          <Carousel className="w-full max-w-xs mx-auto">
            <CarouselContent>
              {items.map((item) => (
                <CarouselItem key={item.id} className="basis-full">
                  <VetementCarouselItem 
                    vetement={item} 
                    isSelected={selectedItems[type]?.id === item.id}
                    onSelect={() => handleSelectItem(type, item)}
                    compact={true}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-3 h-6 w-6" />
            <CarouselNext className="-right-3 h-6 w-6" />
          </Carousel>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-3 py-1">
      {renderCarousel(
        categorizedVetements.hauts, 
        'haut', 
        <Shirt className="h-3 w-3 text-primary" />, 
        'Hauts'
      )}

      {renderCarousel(
        categorizedVetements.bas, 
        'bas', 
        <ShoppingBag className="h-3 w-3 text-primary" />, 
        'Bas'
      )}

      {renderCarousel(
        categorizedVetements.chaussures, 
        'chaussures', 
        <Footprints className="h-3 w-3 text-primary" />, 
        'Chaussures'
      )}
    </div>
  );
};

export default EnsembleCreator;

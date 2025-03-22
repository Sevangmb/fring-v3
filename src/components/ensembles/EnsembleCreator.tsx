
import React, { useState, useEffect } from 'react';
import { Vetement } from '@/services/vetement/types';
import { VetementType } from '@/services/meteo/tenue';
import { determinerTypeVetement } from '@/services/meteo/tenue';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import VetementCarouselItem from './VetementCarouselItem';
import { Shirt, ShoppingBag, Footprints } from 'lucide-react';
import { Text } from '@/components/atoms/Typography';
import { Separator } from '@/components/ui/separator';

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
    return (
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <div className="bg-primary/10 rounded-full p-1.5">
            {icon}
          </div>
          <Text className="font-medium">{label}</Text>
          <Text className="text-sm text-muted-foreground ml-1">({items.length})</Text>
          <Separator className="flex-grow ml-2" />
        </div>
        
        {items.length === 0 ? (
          <div className="text-center py-6 bg-muted/30 rounded-lg border border-dashed border-muted">
            <Text className="text-muted-foreground">Aucun {label.toLowerCase()} disponible</Text>
          </div>
        ) : (
          <div className="px-4 relative">
            <Carousel className="w-full mx-auto">
              <CarouselContent className="ml-0">
                {items.map((item) => (
                  <CarouselItem key={item.id} className="basis-1/2 md:basis-1/3 lg:basis-1/4 pl-4 pr-0">
                    <VetementCarouselItem 
                      vetement={item} 
                      isSelected={selectedItems[type]?.id === item.id}
                      onSelect={() => handleSelectItem(type, item)}
                      compact={false}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="-left-1 h-8 w-8" />
              <CarouselNext className="-right-1 h-8 w-8" />
            </Carousel>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-2">
      {renderCarousel(
        categorizedVetements.hauts, 
        'haut', 
        <Shirt className="h-4 w-4 text-primary" />, 
        'Hauts'
      )}

      {renderCarousel(
        categorizedVetements.bas, 
        'bas', 
        <ShoppingBag className="h-4 w-4 text-primary" />, 
        'Bas'
      )}

      {renderCarousel(
        categorizedVetements.chaussures, 
        'chaussures', 
        <Footprints className="h-4 w-4 text-primary" />, 
        'Chaussures'
      )}
    </div>
  );
};

export default EnsembleCreator;

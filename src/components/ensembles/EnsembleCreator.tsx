
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

  // Catégoriser les vêtements par type
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
      
      // Sélectionner par défaut le premier élément de chaque catégorie
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

  return (
    <div className="space-y-12 py-4">
      {/* Hauts */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b pb-2">
          <Shirt className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">Hauts ({categorizedVetements.hauts.length})</h3>
        </div>
        
        {categorizedVetements.hauts.length === 0 ? (
          <div className="text-center py-4 bg-muted/30 rounded-lg">
            <p className="text-muted-foreground">Aucun haut disponible</p>
          </div>
        ) : (
          <Carousel className="max-w-xs mx-auto">
            <CarouselContent>
              {categorizedVetements.hauts.map((item) => (
                <CarouselItem key={item.id} className="basis-full">
                  <VetementCarouselItem 
                    vetement={item} 
                    isSelected={selectedItems.haut?.id === item.id}
                    onSelect={() => handleSelectItem('haut', item)}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-6" />
            <CarouselNext className="-right-6" />
          </Carousel>
        )}
      </div>

      {/* Bas */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b pb-2">
          <ShoppingBag className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">Bas ({categorizedVetements.bas.length})</h3>
        </div>
        
        {categorizedVetements.bas.length === 0 ? (
          <div className="text-center py-4 bg-muted/30 rounded-lg">
            <p className="text-muted-foreground">Aucun bas disponible</p>
          </div>
        ) : (
          <Carousel className="max-w-xs mx-auto">
            <CarouselContent>
              {categorizedVetements.bas.map((item) => (
                <CarouselItem key={item.id} className="basis-full">
                  <VetementCarouselItem 
                    vetement={item} 
                    isSelected={selectedItems.bas?.id === item.id}
                    onSelect={() => handleSelectItem('bas', item)}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-6" />
            <CarouselNext className="-right-6" />
          </Carousel>
        )}
      </div>

      {/* Chaussures */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b pb-2">
          <Footprints className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">Chaussures ({categorizedVetements.chaussures.length})</h3>
        </div>
        
        {categorizedVetements.chaussures.length === 0 ? (
          <div className="text-center py-4 bg-muted/30 rounded-lg">
            <p className="text-muted-foreground">Aucun chaussures disponible</p>
          </div>
        ) : (
          <Carousel className="max-w-xs mx-auto">
            <CarouselContent>
              {categorizedVetements.chaussures.map((item) => (
                <CarouselItem key={item.id} className="basis-full">
                  <VetementCarouselItem 
                    vetement={item} 
                    isSelected={selectedItems.chaussures?.id === item.id}
                    onSelect={() => handleSelectItem('chaussures', item)}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-6" />
            <CarouselNext className="-right-6" />
          </Carousel>
        )}
      </div>
    </div>
  );
};

export default EnsembleCreator;

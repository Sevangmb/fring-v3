
import React from 'react';
import { Vetement } from '@/services/vetement/types';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import VetementCarouselItem from './VetementCarouselItem';
import { Text } from '@/components/atoms/Typography';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import OwnerSelector, { Owner } from './OwnerSelector';

interface CategoryCarouselProps {
  items: Vetement[];
  type: 'haut' | 'bas' | 'chaussures';
  icon: React.ReactNode;
  label: string;
  selectedItem: Vetement | null;
  onSelectItem: (item: Vetement) => void;
  owners: Owner[];
  selectedOwnerId: string;
  onOwnerChange: (ownerId: string) => void;
  showOwner?: boolean;
}

const CategoryCarousel: React.FC<CategoryCarouselProps> = ({
  items,
  type,
  icon,
  label,
  selectedItem,
  onSelectItem,
  owners,
  selectedOwnerId,
  onOwnerChange,
  showOwner = false
}) => {
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
      
      {/* Sélecteur de propriétaire */}
      <div className="mb-3">
        <OwnerSelector 
          owners={owners} 
          selectedOwnerId={selectedOwnerId} 
          onChange={onOwnerChange} 
        />
      </div>
      
      {items.length === 0 ? (
        <div className="text-center py-6 bg-muted/30 rounded-lg border border-dashed border-muted">
          <Text className="text-muted-foreground">Aucun {label.toLowerCase()} disponible</Text>
        </div>
      ) : (
        <div className="px-12 relative">
          <Carousel className="w-full mx-auto" opts={{ align: "center" }}>
            <CarouselContent>
              {items.map((item) => (
                <CarouselItem key={item.id} className="basis-full">
                  <div className="flex justify-center">
                    <div className="w-full max-w-[200px]">
                      <VetementCarouselItem 
                        vetement={item} 
                        isSelected={selectedItem?.id === item.id}
                        onSelect={() => onSelectItem(item)}
                        compact={false}
                      />
                      
                      {(showOwner || item.owner_email) && (
                        <div className="mt-1 flex justify-center">
                          <Badge variant="outline" className="text-xs font-normal">
                            {item.owner_email ? `De: ${item.owner_email.split('@')[0]}` : 'Moi'}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-8 h-8 w-8" />
            <CarouselNext className="-right-8 h-8 w-8" />
          </Carousel>
        </div>
      )}
    </div>
  );
};

export default CategoryCarousel;


import React, { useState, useEffect } from 'react';
import { Vetement } from '@/services/vetement/types';
import { VetementType } from '@/services/meteo/tenue';
import { determinerTypeVetement } from '@/services/meteo/tenue';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import VetementCarouselItem from './VetementCarouselItem';
import { Shirt, ShoppingBag, Footprints, User, Users } from 'lucide-react';
import { Text } from '@/components/atoms/Typography';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { fetchVetementsAmis } from '@/services/vetement';

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
  showOwner?: boolean;
}

interface Owner {
  id: string;
  name: string;
}

const EnsembleCreator: React.FC<EnsembleCreatorProps> = ({ 
  vetements, 
  selectedItems, 
  onItemsSelected,
  showOwner = false
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

  // État pour suivre les propriétaires uniques
  const [owners, setOwners] = useState<Owner[]>([
    { id: 'me', name: 'Mes vêtements' }
  ]);

  // État pour suivre la sélection du propriétaire pour chaque catégorie
  const [selectedOwners, setSelectedOwners] = useState({
    haut: 'me',
    bas: 'me',
    chaussures: 'me'
  });

  // Vêtements filtrés par propriétaire pour chaque catégorie
  const [filteredVetements, setFilteredVetements] = useState<{
    hauts: Vetement[];
    bas: Vetement[];
    chaussures: Vetement[];
  }>({
    hauts: [],
    bas: [],
    chaussures: []
  });

  // Effet pour extraire les propriétaires uniques des vêtements
  useEffect(() => {
    const uniqueOwners = new Map<string, Owner>();
    uniqueOwners.set('me', { id: 'me', name: 'Mes vêtements' });
    
    vetements.forEach(vetement => {
      if (vetement.owner_email && vetement.user_id) {
        const ownerName = vetement.owner_email.split('@')[0];
        uniqueOwners.set(vetement.user_id, { 
          id: vetement.user_id, 
          name: ownerName 
        });
      }
    });
    
    setOwners(Array.from(uniqueOwners.values()));
  }, [vetements]);

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
      setFilteredVetements({ hauts, bas, chaussures });
      
      // Auto-sélectionner le premier élément de chaque catégorie s'il n'y a pas déjà de sélection
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

  // Filtrer les vêtements par propriétaire lorsque la sélection change
  useEffect(() => {
    const filterByOwner = () => {
      setFilteredVetements({
        hauts: categorizedVetements.hauts.filter(item => 
          selectedOwners.haut === 'me' 
            ? !item.owner_email 
            : item.user_id === selectedOwners.haut
        ),
        bas: categorizedVetements.bas.filter(item => 
          selectedOwners.bas === 'me' 
            ? !item.owner_email 
            : item.user_id === selectedOwners.bas
        ),
        chaussures: categorizedVetements.chaussures.filter(item => 
          selectedOwners.chaussures === 'me' 
            ? !item.owner_email 
            : item.user_id === selectedOwners.chaussures
        ),
      });
    };

    filterByOwner();
  }, [selectedOwners, categorizedVetements]);

  const handleSelectItem = (type: 'haut' | 'bas' | 'chaussures', item: Vetement) => {
    onItemsSelected({
      ...selectedItems,
      [type]: item
    });
  };

  const handleOwnerChange = (type: 'haut' | 'bas' | 'chaussures', ownerId: string) => {
    setSelectedOwners(prev => ({
      ...prev,
      [type]: ownerId
    }));
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
          
          {/* Sélecteur de propriétaire */}
          <div className="min-w-40">
            <Select 
              value={selectedOwners[type]} 
              onValueChange={(value) => handleOwnerChange(type, value)}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Choisir source" />
              </SelectTrigger>
              <SelectContent>
                {owners.map((owner) => (
                  <SelectItem key={owner.id} value={owner.id} className="text-xs">
                    <div className="flex items-center gap-1.5">
                      {owner.id === 'me' ? (
                        <User className="h-3 w-3" />
                      ) : (
                        <Users className="h-3 w-3" />
                      )}
                      {owner.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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
                          isSelected={selectedItems[type]?.id === item.id}
                          onSelect={() => handleSelectItem(type, item)}
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

  return (
    <div className="space-y-2">
      {renderCarousel(
        filteredVetements.hauts, 
        'haut', 
        <Shirt className="h-4 w-4 text-primary" />, 
        'Hauts'
      )}

      {renderCarousel(
        filteredVetements.bas, 
        'bas', 
        <ShoppingBag className="h-4 w-4 text-primary" />, 
        'Bas'
      )}

      {renderCarousel(
        filteredVetements.chaussures, 
        'chaussures', 
        <Footprints className="h-4 w-4 text-primary" />, 
        'Chaussures'
      )}
    </div>
  );
};

export default EnsembleCreator;


import React from 'react';
import { Vetement } from '@/services/vetement/types';
import { Shirt, ShoppingBag, Footprints } from 'lucide-react';
import CategoryCarousel from './CategoryCarousel';
import { useVetementsFilter } from '@/hooks/useVetementsFilter';

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

const EnsembleCreator: React.FC<EnsembleCreatorProps> = ({ 
  vetements, 
  selectedItems, 
  onItemsSelected,
  showOwner = false
}) => {
  const {
    filteredVetements,
    owners,
    selectedOwners,
    handleOwnerChange
  } = useVetementsFilter(vetements);

  const handleSelectItem = (type: 'haut' | 'bas' | 'chaussures', item: Vetement) => {
    onItemsSelected({
      ...selectedItems,
      [type]: item
    });
  };

  return (
    <div className="space-y-2">
      <CategoryCarousel
        items={filteredVetements.hauts}
        type="haut"
        icon={<Shirt className="h-4 w-4 text-primary" />}
        label="Hauts"
        selectedItem={selectedItems.haut}
        onSelectItem={(item) => handleSelectItem('haut', item)}
        owners={owners}
        selectedOwnerId={selectedOwners.haut}
        onOwnerChange={(ownerId) => handleOwnerChange('haut', ownerId)}
        showOwner={showOwner}
      />

      <CategoryCarousel
        items={filteredVetements.bas}
        type="bas"
        icon={<ShoppingBag className="h-4 w-4 text-primary" />}
        label="Bas"
        selectedItem={selectedItems.bas}
        onSelectItem={(item) => handleSelectItem('bas', item)}
        owners={owners}
        selectedOwnerId={selectedOwners.bas}
        onOwnerChange={(ownerId) => handleOwnerChange('bas', ownerId)}
        showOwner={showOwner}
      />

      <CategoryCarousel
        items={filteredVetements.chaussures}
        type="chaussures"
        icon={<Footprints className="h-4 w-4 text-primary" />}
        label="Chaussures"
        selectedItem={selectedItems.chaussures}
        onSelectItem={(item) => handleSelectItem('chaussures', item)}
        owners={owners}
        selectedOwnerId={selectedOwners.chaussures}
        onOwnerChange={(ownerId) => handleOwnerChange('chaussures', ownerId)}
        showOwner={showOwner}
      />
    </div>
  );
};

export default EnsembleCreator;

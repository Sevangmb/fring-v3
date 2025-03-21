
import React from 'react';
import { Vetement } from '@/services/vetement/types';
import ClothingDetailCard from './ClothingDetailCard';
import { Shirt, ShoppingBag, Footprints } from 'lucide-react';

interface TenueDetailsProps {
  haut: Vetement | null;
  bas: Vetement | null;
  chaussures: Vetement | null;
}

const TenueDetails: React.FC<TenueDetailsProps> = ({ haut, bas, chaussures }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Haut - Détails */}
      <ClothingDetailCard 
        item={haut}
        type="Haut"
        icon={<Shirt className="h-5 w-5 text-amber-600 dark:text-amber-400 mr-2" />}
      />
      
      {/* Bas - Détails */}
      <ClothingDetailCard 
        item={bas}
        type="Bas"
        icon={<ShoppingBag className="h-5 w-5 text-amber-600 dark:text-amber-400 mr-2" />}
      />
      
      {/* Chaussures - Détails */}
      <ClothingDetailCard 
        item={chaussures}
        type="Chaussures"
        icon={<Footprints className="h-5 w-5 text-amber-600 dark:text-amber-400 mr-2" />}
      />
    </div>
  );
};

export default TenueDetails;


import React from 'react';
import { Text } from '@/components/atoms/Typography';
import { Shirt, ShoppingBag, Footprints } from 'lucide-react';
import { Vetement } from '@/services/vetement/types';
import ClothingPreview from './ClothingPreview';

interface TenuePreviewsProps {
  haut: Vetement | null;
  bas: Vetement | null;
  chaussures: Vetement | null;
}

const TenuePreviews: React.FC<TenuePreviewsProps> = ({ haut, bas, chaussures }) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex-1 flex justify-center">
        <div className="grid grid-cols-3 gap-4 w-full">
          {/* Haut */}
          <ClothingPreview 
            item={haut} 
            type="haut" 
            label={haut?.nom || "Haut"} 
            icon={<Shirt className="h-16 w-16 text-amber-600 dark:text-amber-400" />} 
          />
          
          {/* Bas */}
          <ClothingPreview 
            item={bas} 
            type="bas" 
            label={bas?.nom || "Bas"} 
            icon={<ShoppingBag className="h-16 w-16 text-amber-600 dark:text-amber-400" />} 
          />
          
          {/* Chaussures */}
          <ClothingPreview 
            item={chaussures} 
            type="chaussures" 
            label={chaussures?.nom || "Chaussures"} 
            icon={<Footprints className="h-16 w-16 text-amber-600 dark:text-amber-400" />} 
          />
        </div>
      </div>
    </div>
  );
};

export default TenuePreviews;

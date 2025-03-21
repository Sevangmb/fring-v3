
import React from 'react';
import { Text } from '@/components/atoms/Typography';
import { Vetement } from '@/services/vetement/types';
import { Shirt, ShoppingBag, Footprints } from 'lucide-react';

interface ClothingDetailCardProps {
  item: Vetement | null;
  type: string;
  icon: React.ReactNode;
}

const ClothingDetailCard: React.FC<ClothingDetailCardProps> = ({ item, type, icon }) => {
  const defaultIcon = () => {
    switch(type.toLowerCase()) {
      case 'haut': return <Shirt className="h-6 w-6 text-theme-teal-dark dark:text-theme-teal-medium" />;
      case 'bas': return <ShoppingBag className="h-6 w-6 text-theme-teal-dark dark:text-theme-teal-medium" />;
      case 'chaussures': return <Footprints className="h-6 w-6 text-theme-teal-dark dark:text-theme-teal-medium" />;
      default: return <Shirt className="h-6 w-6 text-theme-teal-dark dark:text-theme-teal-medium" />;
    }
  };

  return (
    <div className="border border-theme-teal-medium/30 dark:border-theme-teal-medium/20 rounded-lg p-3 bg-white/50 dark:bg-white/5">
      <div className="flex items-center mb-2">
        {icon}
        <Text variant="subtle" weight="medium">{type}</Text>
      </div>
      {item ? (
        <div className="flex items-center">
          {item.image_url ? (
            <div className="h-12 w-12 bg-muted/20 rounded mr-3 overflow-hidden">
              <img 
                src={item.image_url} 
                alt={item.nom} 
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="h-10 w-10 bg-theme-teal-light dark:bg-theme-teal-dark/30 rounded-full flex items-center justify-center mr-3">
              {defaultIcon()}
            </div>
          )}
          <div>
            <Text weight="medium" className="line-clamp-1">{item.nom}</Text>
            {item.marque && (
              <Text variant="subtle" className="text-xs line-clamp-1">{item.marque}</Text>
            )}
          </div>
        </div>
      ) : (
        <Text variant="subtle" className="italic">Aucun {type.toLowerCase()} disponible</Text>
      )}
    </div>
  );
};

export default ClothingDetailCard;

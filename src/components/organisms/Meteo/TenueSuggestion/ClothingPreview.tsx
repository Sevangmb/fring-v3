
import React from 'react';
import { Text } from '@/components/atoms/Typography';
import { Vetement } from '@/services/vetement/types';

interface ClothingPreviewProps {
  item: Vetement | null;
  type: string;
  label: string;
  icon: React.ReactNode;
}

const ClothingPreview: React.FC<ClothingPreviewProps> = ({ item, type, label, icon }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="h-40 w-40 bg-white/80 dark:bg-white/10 rounded-lg border border-theme-teal-medium dark:border-theme-teal-medium/60 overflow-hidden shadow-md mb-2">
        {item?.image_url ? (
          <img 
            src={item.image_url} 
            alt={item.nom} 
            className="w-full h-full object-contain p-1"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-theme-teal-light/50 dark:bg-theme-teal-dark/20">
            {icon}
          </div>
        )}
      </div>
      <Text variant="subtle" className="text-center font-medium">{label}</Text>
    </div>
  );
};

export default ClothingPreview;

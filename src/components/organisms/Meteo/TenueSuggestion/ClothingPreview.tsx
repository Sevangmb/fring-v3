
import React from 'react';
import { Text } from '@/components/atoms/Typography';
import { Vetement } from '@/services/vetement/types';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ClothingPreviewProps {
  item: Vetement | null;
  type: string;
  label: string;
  icon: React.ReactNode;
}

const ClothingPreview: React.FC<ClothingPreviewProps> = ({
  item,
  type,
  label,
  icon
}) => {
  return (
    <div className="flex flex-col items-center">
      <div className="w-full aspect-square flex items-center justify-center bg-white/50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 mb-2 overflow-hidden">
        {item && item.image_url ? (
          <img 
            src={item.image_url} 
            alt={item.nom} 
            className="h-full w-full object-contain p-2"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full w-full p-4">
            {icon}
            <Text className="text-center mt-2 text-sm text-muted-foreground">{type}</Text>
          </div>
        )}
      </div>
      <Text className={cn(
        "text-center font-medium text-sm",
        item ? "text-primary" : "text-muted-foreground"
      )}>
        {item ? item.nom : label}
      </Text>
    </div>
  );
};

export default ClothingPreview;

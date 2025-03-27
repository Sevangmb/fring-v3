
import React from 'react';
import { Text } from '@/components/atoms/Typography';
import { Vetement } from '@/services/vetement/types';

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
    <div className="border rounded-lg p-3 bg-muted/30 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <Text className="font-medium">{label}</Text>
      </div>
      
      {item ? (
        <div className="flex flex-col flex-1">
          <div className="mb-2 flex-1">
            {item.image_url ? (
              <div className="relative h-24 w-full overflow-hidden rounded-md bg-muted">
                <img 
                  src={item.image_url}
                  alt={item.nom}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="h-24 w-full rounded-md bg-accent flex items-center justify-center">
                <Text className="text-xs text-muted-foreground">Pas d'image</Text>
              </div>
            )}
          </div>
          <Text className="font-medium line-clamp-1">{item.nom}</Text>
          <Text variant="small" className="text-muted-foreground line-clamp-1">{item.marque}</Text>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <Text className="text-sm text-muted-foreground">Aucun {type} suggéré</Text>
        </div>
      )}
    </div>
  );
};

export default ClothingPreview;

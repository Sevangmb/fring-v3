
import React from 'react';
import { Shirt } from 'lucide-react';

interface VetementCardImageProps {
  imageUrl?: string;
  nom: string;
}

const VetementCardImage: React.FC<VetementCardImageProps> = ({ imageUrl, nom }) => {
  return (
    <div className="aspect-square bg-muted/20 relative">
      {imageUrl ? (
        <img 
          src={imageUrl} 
          alt={nom} 
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <Shirt size={64} className="text-muted-foreground opacity-20" />
        </div>
      )}
    </div>
  );
};

export default VetementCardImage;

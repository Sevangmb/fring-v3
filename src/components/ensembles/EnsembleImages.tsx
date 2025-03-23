
import React from 'react';
import { VetementType } from '@/services/meteo/tenue';

interface EnsembleImagesProps {
  vetementsByType: Record<string, any[]>;
  className?: string;
}

const EnsembleImages: React.FC<EnsembleImagesProps> = ({ vetementsByType, className = "" }) => {
  const hasAnyVetement = Object.values(vetementsByType).some(array => array.length > 0);
  
  if (!hasAnyVetement) {
    return (
      <div className={`grid place-items-center ${className}`}>
        <p className="text-sm text-muted-foreground">Aucun vêtement disponible</p>
      </div>
    );
  }
  
  return (
    <div className={`grid grid-cols-3 gap-2 ${className}`}>
      <div className="bg-muted/40 rounded-md p-1 flex items-center justify-center">
        {vetementsByType[VetementType.HAUT][0]?.image_url ? (
          <img 
            src={vetementsByType[VetementType.HAUT][0].image_url} 
            alt="Haut" 
            className="max-h-full max-w-full object-contain"
          />
        ) : (
          <div className="text-xs text-muted-foreground">Haut</div>
        )}
      </div>
      
      <div className="bg-muted/40 rounded-md p-1 flex items-center justify-center">
        {vetementsByType[VetementType.BAS][0]?.image_url ? (
          <img 
            src={vetementsByType[VetementType.BAS][0].image_url} 
            alt="Bas" 
            className="max-h-full max-w-full object-contain"
          />
        ) : (
          <div className="text-xs text-muted-foreground">Bas</div>
        )}
      </div>
      
      <div className="bg-muted/40 rounded-md p-1 flex items-center justify-center">
        {vetementsByType[VetementType.CHAUSSURES][0]?.image_url ? (
          <img 
            src={vetementsByType[VetementType.CHAUSSURES][0].image_url} 
            alt="Chaussures" 
            className="max-h-full max-w-full object-contain"
          />
        ) : (
          <div className="text-xs text-muted-foreground">Chaussures</div>
        )}
      </div>
    </div>
  );
};

export default EnsembleImages;

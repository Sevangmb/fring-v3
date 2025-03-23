
import React from 'react';
import { VetementType } from '@/services/meteo/tenue';

interface EnsembleImagesProps {
  vetementsByType: Record<string, any[]>;
  className?: string; // Added className prop
}

const EnsembleImages: React.FC<EnsembleImagesProps> = ({ vetementsByType, className = "" }) => {
  return (
    <div className={`grid grid-cols-3 gap-2 h-32 ${className}`}>
      {vetementsByType[VetementType.HAUT][0] && (
        <div className="bg-muted/40 rounded-md p-1 flex items-center justify-center">
          {vetementsByType[VetementType.HAUT][0].image_url ? (
            <img 
              src={vetementsByType[VetementType.HAUT][0].image_url} 
              alt="Haut" 
              className="max-h-full max-w-full object-contain"
            />
          ) : (
            <div className="text-xs text-muted-foreground">Haut</div>
          )}
        </div>
      )}
      
      {vetementsByType[VetementType.BAS][0] && (
        <div className="bg-muted/40 rounded-md p-1 flex items-center justify-center">
          {vetementsByType[VetementType.BAS][0].image_url ? (
            <img 
              src={vetementsByType[VetementType.BAS][0].image_url} 
              alt="Bas" 
              className="max-h-full max-w-full object-contain"
            />
          ) : (
            <div className="text-xs text-muted-foreground">Bas</div>
          )}
        </div>
      )}
      
      {vetementsByType[VetementType.CHAUSSURES][0] && (
        <div className="bg-muted/40 rounded-md p-1 flex items-center justify-center">
          {vetementsByType[VetementType.CHAUSSURES][0].image_url ? (
            <img 
              src={vetementsByType[VetementType.CHAUSSURES][0].image_url} 
              alt="Chaussures" 
              className="max-h-full max-w-full object-contain"
            />
          ) : (
            <div className="text-xs text-muted-foreground">Chaussures</div>
          )}
        </div>
      )}
    </div>
  );
};

export default EnsembleImages;

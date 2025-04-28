
import React, { useEffect } from 'react';
import { VetementType } from '@/services/meteo/tenue';
import { Shirt, ShoppingBag, Footprints } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EnsembleImagesProps {
  vetementsByType: Record<string, any[]>;
  className?: string;
}

const EnsembleImages: React.FC<EnsembleImagesProps> = ({ vetementsByType, className = "" }) => {
  // Vérification des données
  const hasVetements = vetementsByType && typeof vetementsByType === 'object';
  const hasAnyVetement = hasVetements && Object.values(vetementsByType).some(array => array && array.length > 0);
  
  useEffect(() => {
    console.log("EnsembleImages - Vêtements par type:", vetementsByType);
    console.log("EnsembleImages - hasAnyVetement:", hasAnyVetement);
  }, [vetementsByType, hasAnyVetement]);
  
  if (!hasVetements || !hasAnyVetement) {
    return (
      <div className={cn("grid place-items-center p-4 bg-muted/10 rounded-lg", className)}>
        <p className="text-sm text-muted-foreground">Aucun vêtement disponible</p>
      </div>
    );
  }
  
  const getImageUrl = (item: any) => {
    if (!item) return null;
    return item.vetement?.image_url || item.image_url || null;
  };
  
  const renderVetementImage = (type: string, placeholderIcon: React.ReactNode, label: string) => {
    const vetements = vetementsByType[type];
    const hasVetement = vetements && Array.isArray(vetements) && vetements.length > 0;
    const imageUrl = hasVetement ? getImageUrl(vetements[0]) : null;
    
    return (
      <div className="bg-muted/40 rounded-md p-1 flex items-center justify-center overflow-hidden aspect-square">
        {imageUrl ? (
          <div className="relative w-full h-full flex items-center justify-center">
            <img 
              src={imageUrl} 
              alt={label} 
              className="max-h-full max-w-full object-contain"
              loading="lazy"
              onError={(e) => {
                console.error(`Erreur de chargement d'image pour ${type}:`, imageUrl);
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                if (target.parentElement) {
                  const fallback = target.parentElement.querySelector('.fallback');
                  if (fallback) {
                    fallback.classList.remove('hidden');
                    fallback.classList.add('flex');
                  }
                }
              }}
            />
            <div className="fallback hidden items-center justify-center flex-col text-muted-foreground">
              {placeholderIcon}
              <span className="text-xs mt-1">{label}</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center flex-col text-muted-foreground p-2">
            {placeholderIcon}
            <span className="text-xs mt-1">{label}</span>
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className={cn("grid grid-cols-3 gap-2", className)}>
      {renderVetementImage(
        VetementType.HAUT, 
        <Shirt className="h-8 w-8 opacity-50" />, 
        "Haut"
      )}
      
      {renderVetementImage(
        VetementType.BAS, 
        <ShoppingBag className="h-8 w-8 opacity-50" />, 
        "Bas"
      )}
      
      {renderVetementImage(
        VetementType.CHAUSSURES, 
        <Footprints className="h-8 w-8 opacity-50" />, 
        "Chaussures"
      )}
    </div>
  );
};

export default EnsembleImages;

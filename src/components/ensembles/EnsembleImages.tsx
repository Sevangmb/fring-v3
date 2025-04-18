
import React, { useEffect } from 'react';
import { VetementType } from '@/services/meteo/tenue';
import { Shirt, ShoppingBag, Footprints } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface EnsembleImagesProps {
  vetementsByType: Record<string, any[]>;
  className?: string;
}

const EnsembleImages: React.FC<EnsembleImagesProps> = ({ vetementsByType, className = "" }) => {
  const hasAnyVetement = Object.values(vetementsByType).some(array => array.length > 0);
  
  useEffect(() => {
    console.log("Ensemble Images - Vêtements par type:", vetementsByType);
    // Vérifier les URLs d'images
    Object.entries(vetementsByType).forEach(([type, items]) => {
      items.forEach((item, idx) => {
        console.log(`Type ${type}, item ${idx}, image_url:`, item.vetement?.image_url || item.image_url);
      });
    });
  }, [vetementsByType]);
  
  if (!hasAnyVetement) {
    return (
      <div className={`grid place-items-center ${className}`}>
        <p className="text-sm text-muted-foreground">Aucun vêtement disponible</p>
      </div>
    );
  }
  
  const getImageUrl = (item: any) => {
    // Support both vetement and direct image_url formats
    return item.vetement?.image_url || item.image_url;
  };
  
  const renderVetementImage = (type: string, placeholderIcon: React.ReactNode, label: string) => {
    const vetements = vetementsByType[type];
    const hasVetement = vetements && vetements.length > 0;
    const imageUrl = hasVetement ? getImageUrl(vetements[0]) : null;
    
    console.log(`Rendering ${type} with image URL:`, imageUrl);
    
    return (
      <div className="bg-muted/40 rounded-md p-1 flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          <div className="relative w-full h-full min-h-24 flex items-center justify-center">
            <img 
              src={imageUrl} 
              alt={label} 
              className="max-h-full max-w-full object-contain"
              onError={(e) => {
                console.error(`Erreur de chargement d'image pour ${type}:`, imageUrl);
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                if (target.parentElement) {
                  const fallback = target.parentElement.querySelector('.fallback');
                  if (fallback) fallback.classList.remove('hidden');
                  fallback?.classList.add('flex');
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
    <div className={`grid grid-cols-3 gap-2 ${className}`}>
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

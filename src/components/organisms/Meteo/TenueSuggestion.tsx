
import React from 'react';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/atoms/Typography';
import { Shirt, ShoppingBag, Footprints, Umbrella } from 'lucide-react';
import { Vetement } from '@/services/vetement/types';
import { VetementType } from '@/services/meteo/tenueService';

interface TenueSuggestionProps {
  haut: Vetement | null;
  bas: Vetement | null;
  chaussures: Vetement | null;
  message: string;
}

const TenueSuggestion: React.FC<TenueSuggestionProps> = ({
  haut,
  bas,
  chaussures,
  message
}) => {
  const isRainyWeather = message.toLowerCase().includes('pleut');
  
  return (
    <Card className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-100 dark:border-amber-800">
      <div className="flex justify-between items-center mb-3">
        <Text as="h3" variant="h4">Suggestion de tenue</Text>
        {isRainyWeather && (
          <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 py-1 px-2 rounded-full">
            <Umbrella size={16} />
            <span className="text-xs font-medium">Temps pluvieux</span>
          </div>
        )}
      </div>
      
      <Text className="mb-4">{message}</Text>
      
      {/* Affichage principal de la tenue avec images */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Photos des vêtements */}
        <div className="flex-1 flex justify-center">
          <div className="grid grid-cols-3 gap-4 w-full">
            {/* Haut */}
            <div className="flex flex-col items-center">
              <div className="h-40 w-40 bg-white/80 dark:bg-white/10 rounded-lg border border-amber-200 dark:border-amber-800 overflow-hidden shadow-md mb-2">
                {haut?.image_url ? (
                  <img 
                    src={haut.image_url} 
                    alt={haut.nom} 
                    className="w-full h-full object-contain p-1"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-amber-100/50 dark:bg-amber-900/20">
                    <Shirt className="h-16 w-16 text-amber-600 dark:text-amber-400" />
                  </div>
                )}
              </div>
              <Text variant="subtle" className="text-center font-medium">{haut?.nom || "Haut"}</Text>
            </div>
            
            {/* Bas */}
            <div className="flex flex-col items-center">
              <div className="h-40 w-40 bg-white/80 dark:bg-white/10 rounded-lg border border-amber-200 dark:border-amber-800 overflow-hidden shadow-md mb-2">
                {bas?.image_url ? (
                  <img 
                    src={bas.image_url} 
                    alt={bas.nom} 
                    className="w-full h-full object-contain p-1"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-amber-100/50 dark:bg-amber-900/20">
                    <ShoppingBag className="h-16 w-16 text-amber-600 dark:text-amber-400" />
                  </div>
                )}
              </div>
              <Text variant="subtle" className="text-center font-medium">{bas?.nom || "Bas"}</Text>
            </div>
            
            {/* Chaussures */}
            <div className="flex flex-col items-center">
              <div className="h-40 w-40 bg-white/80 dark:bg-white/10 rounded-lg border border-amber-200 dark:border-amber-800 overflow-hidden shadow-md mb-2">
                {chaussures?.image_url ? (
                  <img 
                    src={chaussures.image_url} 
                    alt={chaussures.nom} 
                    className="w-full h-full object-contain p-1"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-amber-100/50 dark:bg-amber-900/20">
                    <Footprints className="h-16 w-16 text-amber-600 dark:text-amber-400" />
                  </div>
                )}
              </div>
              <Text variant="subtle" className="text-center font-medium">{chaussures?.nom || "Chaussures"}</Text>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Haut - Détails */}
        <div className="border border-amber-200 dark:border-amber-800 rounded-lg p-3 bg-white/50 dark:bg-white/5">
          <div className="flex items-center mb-2">
            <Shirt className="h-5 w-5 text-amber-600 dark:text-amber-400 mr-2" />
            <Text variant="subtle" weight="medium">Haut</Text>
          </div>
          {haut ? (
            <div className="flex items-center">
              {haut.image_url ? (
                <div className="h-12 w-12 bg-muted/20 rounded mr-3 overflow-hidden">
                  <img 
                    src={haut.image_url} 
                    alt={haut.nom} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-10 w-10 bg-amber-100 dark:bg-amber-800/30 rounded-full flex items-center justify-center mr-3">
                  <Shirt className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
              )}
              <div>
                <Text weight="medium" className="line-clamp-1">{haut.nom}</Text>
                {haut.marque && (
                  <Text variant="subtle" className="text-xs line-clamp-1">{haut.marque}</Text>
                )}
              </div>
            </div>
          ) : (
            <Text variant="subtle" className="italic">Aucun haut disponible</Text>
          )}
        </div>
        
        {/* Bas - Détails */}
        <div className="border border-amber-200 dark:border-amber-800 rounded-lg p-3 bg-white/50 dark:bg-white/5">
          <div className="flex items-center mb-2">
            <ShoppingBag className="h-5 w-5 text-amber-600 dark:text-amber-400 mr-2" />
            <Text variant="subtle" weight="medium">Bas</Text>
          </div>
          {bas ? (
            <div className="flex items-center">
              {bas.image_url ? (
                <div className="h-12 w-12 bg-muted/20 rounded mr-3 overflow-hidden">
                  <img 
                    src={bas.image_url} 
                    alt={bas.nom} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-10 w-10 bg-amber-100 dark:bg-amber-800/30 rounded-full flex items-center justify-center mr-3">
                  <ShoppingBag className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
              )}
              <div>
                <Text weight="medium" className="line-clamp-1">{bas.nom}</Text>
                {bas.marque && (
                  <Text variant="subtle" className="text-xs line-clamp-1">{bas.marque}</Text>
                )}
              </div>
            </div>
          ) : (
            <Text variant="subtle" className="italic">Aucun bas disponible</Text>
          )}
        </div>
        
        {/* Chaussures - Détails */}
        <div className="border border-amber-200 dark:border-amber-800 rounded-lg p-3 bg-white/50 dark:bg-white/5">
          <div className="flex items-center mb-2">
            <Footprints className="h-5 w-5 text-amber-600 dark:text-amber-400 mr-2" />
            <Text variant="subtle" weight="medium">Chaussures</Text>
          </div>
          {chaussures ? (
            <div className="flex items-center">
              {chaussures.image_url ? (
                <div className="h-12 w-12 bg-muted/20 rounded mr-3 overflow-hidden">
                  <img 
                    src={chaussures.image_url} 
                    alt={chaussures.nom} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-10 w-10 bg-amber-100 dark:bg-amber-800/30 rounded-full flex items-center justify-center mr-3">
                  <Footprints className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
              )}
              <div>
                <Text weight="medium" className="line-clamp-1">{chaussures.nom}</Text>
                {chaussures.marque && (
                  <Text variant="subtle" className="text-xs line-clamp-1">{chaussures.marque}</Text>
                )}
              </div>
            </div>
          ) : (
            <Text variant="subtle" className="italic">Aucunes chaussures disponibles</Text>
          )}
        </div>
      </div>
    </Card>
  );
};

export default TenueSuggestion;

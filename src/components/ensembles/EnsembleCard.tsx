
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import { Ensemble } from '@/services/ensemble';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useIsMobile } from '@/hooks/use-mobile';

interface EnsembleCardProps {
  ensemble: Ensemble;
  onDelete?: () => void;
}

const EnsembleCard: React.FC<EnsembleCardProps> = ({ ensemble, onDelete }) => {
  const isMobile = useIsMobile();
  
  // Formatage de la date
  const formattedDate = ensemble.created_at
    ? formatDistanceToNow(new Date(ensemble.created_at), { addSuffix: true, locale: fr })
    : '';
  
  // Traitement des vêtements pour l'affichage
  const getVetementsImages = () => {
    // S'assurer que vetements est un tableau
    const vetements = Array.isArray(ensemble.vetements) ? ensemble.vetements : [];
    
    // Extraire les URLs des images pour les 3 premiers vêtements
    return vetements
      .slice(0, 3)
      .map(item => {
        if (item && item.vetement && item.vetement.image_url) {
          return item.vetement.image_url;
        } else if (item && item.vetement) {
          return item.vetement.image_url;
        } else if (item && typeof item === 'object' && 'image_url' in item) {
          return (item as any).image_url;
        }
        return null;
      })
      .filter(url => url !== null);
  };
  
  const imageUrls = getVetementsImages();
  
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg line-clamp-1">{ensemble.nom || 'Ensemble sans nom'}</CardTitle>
          {ensemble.email && (
            <Badge variant="outline" className="text-xs ml-2 flex-shrink-0">
              {ensemble.email.split('@')[0]}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 p-3">
        <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-2 mb-3`}>
          {imageUrls.length > 0 ? (
            imageUrls.map((url, index) => (
              <div 
                key={index}
                className={`bg-cover bg-center rounded-md ${
                  index === 0 ? (isMobile ? 'h-40' : 'col-span-2 h-32') : 'h-20'
                }`}
                style={{ backgroundImage: `url(${url})` }}
              />
            ))
          ) : (
            <div className={`${isMobile ? '' : 'col-span-2'} h-32 bg-muted rounded-md flex items-center justify-center`}>
              <p className="text-muted-foreground text-sm">Aucune image disponible</p>
            </div>
          )}
        </div>
        
        <div className="space-y-1">
          <div className="flex flex-wrap gap-1">
            {ensemble.occasion && (
              <Badge variant="secondary" className="mr-1">
                {ensemble.occasion}
              </Badge>
            )}
            {ensemble.saison && (
              <Badge variant="outline">
                {ensemble.saison}
              </Badge>
            )}
          </div>
          
          {ensemble.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
              {ensemble.description}
            </p>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-2 border-t flex justify-between items-center">
        <span className="text-xs text-muted-foreground">
          {formattedDate}
        </span>
        
        {onDelete && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onDelete}
            className="text-destructive hover:text-destructive/90"
          >
            <Trash size={16} />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default EnsembleCard;

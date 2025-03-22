
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Ensemble } from '@/services/ensembleService';
import { determinerTypeVetement, VetementType } from '@/services/meteo/tenue';
import { CalendarIcon, TagIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface EnsembleCardProps {
  ensemble: Ensemble;
}

const EnsembleCard: React.FC<EnsembleCardProps> = ({ ensemble }) => {
  // Ordonner les vêtements par type
  const vetementsByType = React.useMemo(() => {
    const result: Record<VetementType, any[]> = {
      [VetementType.HAUT]: [],
      [VetementType.BAS]: [],
      [VetementType.CHAUSSURES]: [],
      [VetementType.AUTRE]: []
    };
    
    // Trier les vêtements par position
    const orderedVetements = [...ensemble.vetements].sort(
      (a, b) => a.position_ordre - b.position_ordre
    );
    
    orderedVetements.forEach(item => {
      const type = determinerTypeVetement(item.vetement);
      result[type].push(item.vetement);
    });
    
    return result;
  }, [ensemble]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <Card className="h-full flex flex-col shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">{ensemble.nom}</CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 pb-2">
        <div className="grid grid-cols-3 gap-2 h-32">
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
        
        {ensemble.description && (
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{ensemble.description}</p>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col items-start pt-0">
        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
          <CalendarIcon size={12} />
          <span>Créé le {formatDate(ensemble.created_at)}</span>
        </div>
        
        {(ensemble.occasion || ensemble.saison) && (
          <div className="flex flex-wrap gap-1 mt-1">
            {ensemble.occasion && (
              <Badge variant="outline" className="text-xs py-0">
                <TagIcon size={10} className="mr-1" />
                {ensemble.occasion}
              </Badge>
            )}
            {ensemble.saison && (
              <Badge variant="outline" className="text-xs py-0">
                <TagIcon size={10} className="mr-1" />
                {ensemble.saison}
              </Badge>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default EnsembleCard;

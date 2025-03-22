import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Ensemble } from '@/services/ensemble';
import { VetementType } from '@/services/meteo/tenue';
import EnsembleActions from './EnsembleActions';
import EnsembleImages from './EnsembleImages';
import EnsembleFooter from './EnsembleFooter';
import { determineVetementTypeSync } from './utils/vetementTypeUtils';

interface EnsembleCardProps {
  ensemble: Ensemble;
  onDelete?: () => void;
}

const EnsembleCard: React.FC<EnsembleCardProps> = ({ ensemble, onDelete }) => {
  const vetementsByType = React.useMemo(() => {
    const result: Record<string, any[]> = {
      [VetementType.HAUT]: [],
      [VetementType.BAS]: [],
      [VetementType.CHAUSSURES]: [],
      'autre': []
    };
    
    const orderedVetements = [...ensemble.vetements].sort(
      (a, b) => a.position_ordre - b.position_ordre
    );
    
    orderedVetements.forEach(item => {
      const type = determineVetementTypeSync(item.vetement);
      result[type].push(item.vetement);
    });
    
    return result;
  }, [ensemble]);

  return (
    <Card className="h-full flex flex-col shadow-sm hover:shadow-md transition-shadow relative">
      <EnsembleActions 
        ensembleId={ensemble.id} 
        onDelete={onDelete}
        nom={ensemble.nom} 
      />
      
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">{ensemble.nom}</CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 pb-2">
        <EnsembleImages vetementsByType={vetementsByType} />
        
        {ensemble.description && (
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{ensemble.description}</p>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col items-start pt-0">
        <EnsembleFooter 
          created_at={ensemble.created_at}
          occasion={ensemble.occasion}
          saison={ensemble.saison}
        />
      </CardFooter>
    </Card>
  );
};

export default EnsembleCard;

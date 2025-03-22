import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Ensemble } from '@/services/ensemble';
import { VetementType } from '@/services/meteo/tenue';
import { CalendarIcon, TagIcon, Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { deleteEnsemble } from '@/services/ensemble';

interface EnsembleCardProps {
  ensemble: Ensemble;
  onDelete?: () => void;
}

const EnsembleCard: React.FC<EnsembleCardProps> = ({ ensemble, onDelete }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = React.useState(false);

  const determineVetementTypeSync = (vetement: any): string => {
    const nomLower = vetement.nom ? vetement.nom.toLowerCase() : '';
    const descriptionLower = vetement.description ? vetement.description.toLowerCase() : '';
    const textToCheck = nomLower + ' ' + descriptionLower;
    
    const VETEMENTS_HAUTS = [
      'tshirt', 't-shirt', 'chemise', 'pull', 'sweat', 'sweatshirt', 'veste', 
      'manteau', 'blouson', 'gilet', 'hoodie', 'débardeur', 'top', 'polo'
    ];
    
    const VETEMENTS_BAS = [
      'pantalon', 'jean', 'short', 'jupe', 'bermuda', 'jogging', 'legging'
    ];
    
    const VETEMENTS_CHAUSSURES = [
      'chaussures', 'basket', 'baskets', 'tennis', 'bottes', 'bottines', 
      'mocassins', 'sandales', 'tongs', 'escarpins', 'derbies'
    ];
    
    if (VETEMENTS_HAUTS.some(h => textToCheck.includes(h))) return VetementType.HAUT;
    if (VETEMENTS_BAS.some(b => textToCheck.includes(b))) return VetementType.BAS;
    if (VETEMENTS_CHAUSSURES.some(c => textToCheck.includes(c))) return VetementType.CHAUSSURES;
    
    return 'autre';
  };

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleEdit = () => {
    navigate(`/ensembles/modifier/${ensemble.id}`);
  };

  const handleDelete = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet ensemble ?")) {
      try {
        setIsDeleting(true);
        await deleteEnsemble(ensemble.id);
        toast({
          title: "Succès",
          description: "L'ensemble a été supprimé avec succès"
        });
        if (onDelete) onDelete();
      } catch (error) {
        console.error("Erreur lors de la suppression de l'ensemble:", error);
        toast({
          title: "Erreur",
          description: "Impossible de supprimer l'ensemble",
          variant: "destructive"
        });
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <Card className="h-full flex flex-col shadow-sm hover:shadow-md transition-shadow relative">
      <div className="absolute top-2 right-2 flex gap-1 z-10">
        <Button variant="ghost" size="icon" onClick={handleEdit} className="h-8 w-8 bg-background/80 backdrop-blur-sm">
          <Edit size={16} className="text-muted-foreground hover:text-primary" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleDelete} 
          className="h-8 w-8 bg-background/80 backdrop-blur-sm"
          disabled={isDeleting}
        >
          <Trash2 size={16} className="text-muted-foreground hover:text-destructive" />
        </Button>
      </div>
      
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

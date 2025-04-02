import React from 'react';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/atoms/Typography';
import { Button } from '@/components/ui/button';
import { Vetement } from '@/services/vetement/types';
import { VetementType } from '@/services/meteo/tenue';
import { Save } from 'lucide-react';
import TenueHeader from './TenueSuggestion/TenueHeader';
import TenuePreviews from './TenueSuggestion/TenuePreviews';
import TenueDetails from './TenueSuggestion/TenueDetails';
import { useToast } from '@/hooks/use-toast';
import { createEnsemble, EnsembleCreateParams } from '@/services/ensemble';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isRainyWeather = message.toLowerCase().includes('pleut') || message.toLowerCase().includes('pluie');
  const { toast } = useToast();
  const navigate = useNavigate();
  const [saving, setSaving] = React.useState(false);
  const isMobile = useIsMobile();
  
  const saveAsEnsemble = async () => {
    // Vérifier si tous les éléments nécessaires sont présents
    if (!haut || !bas || !chaussures) {
      toast({
        title: "Impossible de sauvegarder",
        description: "La tenue suggérée n'est pas complète.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setSaving(true);
      
      // Préparer les données pour la création d'ensemble
      const ensembleData: EnsembleCreateParams = {
        nom: `Tenue pour ${isRainyWeather ? 'temps pluvieux' : 'aujourd\'hui'}`,
        description: message,
        vetements: [
          { id: haut.id, type: VetementType.HAUT },
          { id: bas.id, type: VetementType.BAS },
          { id: chaussures.id, type: VetementType.CHAUSSURES }
        ],
        saison: new Date().getMonth() >= 3 && new Date().getMonth() <= 8 ? 'Été' : 'Hiver',
        occasion: 'Quotidien'
      };
      
      await createEnsemble(ensembleData);
      
      toast({
        title: "Tenue sauvegardée",
        description: "La tenue a été sauvegardée avec succès dans vos ensembles.",
      });
      
      // Rediriger vers la page des ensembles après un court délai
      setTimeout(() => {
        navigate('/ensembles');
      }, 1500);
      
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la tenue:', error);
      toast({
        title: "Erreur de sauvegarde",
        description: "Une erreur s'est produite lors de la sauvegarde de la tenue.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };
  
  return (
    <Card className="p-4 bg-gradient-to-br from-theme-teal-light to-white/80 dark:from-theme-teal-dark/20 dark:to-theme-teal-dark/10 border-theme-teal-medium/30 dark:border-theme-teal-medium/20">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <TenueHeader isRainyWeather={isRainyWeather} message={message} />
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="ml-4 bg-theme-teal-medium/10 border-theme-teal-medium/30"
          onClick={saveAsEnsemble}
          disabled={saving || !haut || !bas || !chaussures}
        >
          <Save className="h-4 w-4" />
          {(!isMobile) && <span className="ml-2">{saving ? 'Sauvegarde...' : 'Sauvegarder comme ensemble'}</span>}
        </Button>
      </div>
      
      {/* Affichage principal de la tenue avec images */}
      <TenuePreviews haut={haut} bas={bas} chaussures={chaussures} />
      
      {/* Détails des vêtements */}
      <TenueDetails haut={haut} bas={bas} chaussures={chaussures} />
    </Card>
  );
};

export default TenueSuggestion;

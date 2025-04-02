
import { Vetement } from '@/services/vetement/types';

/**
 * Organiser les vêtements par type pour un affichage structuré
 */
export const organizeVetementsByType = (vetements: any[]): Record<string, any[]> => {
  const result: Record<string, any[]> = {
    hauts: [],
    bas: [],
    chaussures: [],
    accessoires: [],
    autres: []
  };
  
  if (!vetements || !Array.isArray(vetements)) {
    return result;
  }
  
  vetements.forEach(item => {
    const vetement = item.vetement;
    const categorie = vetement?.categorie?.toLowerCase();
    
    if (!categorie) {
      result.autres.push(item);
      return;
    }
    
    if (categorie.includes('haut') || categorie.includes('t-shirt') || categorie.includes('chemise') || categorie.includes('pull')) {
      result.hauts.push(item);
    } else if (categorie.includes('pantalon') || categorie.includes('jupe') || categorie.includes('short')) {
      result.bas.push(item);
    } else if (categorie.includes('chaussure') || categorie.includes('basket') || categorie.includes('boot')) {
      result.chaussures.push(item);
    } else if (categorie.includes('access') || categorie.includes('bijou') || categorie.includes('montre')) {
      result.accessoires.push(item);
    } else {
      result.autres.push(item);
    }
  });
  
  return result;
};

/**
 * Affiche le type de météo de manière lisible
 */
export const displayWeatherType = (weatherType: string | null | undefined): string => {
  if (!weatherType) return 'Normal';
  
  switch(weatherType.toLowerCase()) {
    case 'rain':
    case 'pluie':
      return 'Pluie';
    case 'snow':
    case 'neige':
      return 'Neige';
    case 'sun':
    case 'soleil':
      return 'Ensoleillé';
    case 'cloud':
    case 'nuage':
      return 'Nuageux';
    default:
      return 'Normal';
  }
};


import { VetementType } from '@/services/meteo/tenue';

/**
 * Déterminer le type de vêtement en fonction du nom et de la description
 */
export const determineVetementTypeSync = (vetement: any): string => {
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

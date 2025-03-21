
import { Vetement } from '@/services/vetement/types';

// Types de vêtements selon leur catégorie
export enum VetementType {
  HAUT = 'haut',
  BAS = 'bas',
  CHAUSSURES = 'chaussures'
}

// Classification des vêtements par type
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

/**
 * Détermine le type de vêtement (haut, bas, chaussures) selon sa catégorie
 */
export const determinerTypeVetement = (vetement: Vetement): VetementType | null => {
  const categorieLower = vetement.categorie.toLowerCase();
  
  if (VETEMENTS_HAUTS.some(type => categorieLower.includes(type))) {
    return VetementType.HAUT;
  }
  
  if (VETEMENTS_BAS.some(type => categorieLower.includes(type))) {
    return VetementType.BAS;
  }
  
  if (VETEMENTS_CHAUSSURES.some(type => categorieLower.includes(type))) {
    return VetementType.CHAUSSURES;
  }
  
  return null;
};

/**
 * Suggère une tenue en fonction de la température actuelle
 */
export const suggestVetements = (vetements: Vetement[], temperature: number): { haut: Vetement | null, bas: Vetement | null, chaussures: Vetement | null } => {
  // Trier les vêtements par type
  const hauts = vetements.filter(v => determinerTypeVetement(v) === VetementType.HAUT);
  const bas = vetements.filter(v => determinerTypeVetement(v) === VetementType.BAS);
  const chaussures = vetements.filter(v => determinerTypeVetement(v) === VetementType.CHAUSSURES);
  
  // Déterminer la température appropriée
  let tempType: "froid" | "tempere" | "chaud" = "tempere";
  
  if (temperature <= 10) {
    tempType = "froid";
  } else if (temperature >= 22) {
    tempType = "chaud";
  }
  
  // Filtrer les vêtements selon la température
  const hautsFiltered = hauts.filter(v => v.temperature === tempType || v.temperature === undefined);
  const basFiltered = bas.filter(v => v.temperature === tempType || v.temperature === undefined);
  const chaussuresFiltered = chaussures.filter(v => v.temperature === tempType || v.temperature === undefined);
  
  // Sélectionner aléatoirement un vêtement de chaque type
  const selectRandom = <T>(arr: T[]): T | null => {
    if (arr.length === 0) return null;
    return arr[Math.floor(Math.random() * arr.length)];
  };
  
  return {
    haut: selectRandom(hautsFiltered.length > 0 ? hautsFiltered : hauts),
    bas: selectRandom(basFiltered.length > 0 ? basFiltered : bas),
    chaussures: selectRandom(chaussuresFiltered.length > 0 ? chaussuresFiltered : chaussures)
  };
};

/**
 * Génère un message de suggestion de tenue selon la météo
 */
export const generateOutfitMessage = (temperature: number, description: string): string => {
  if (temperature <= 5) {
    return `Il fait très froid (${temperature}°C) avec ${description}. Portez plusieurs couches et n'oubliez pas un manteau chaud et des gants.`;
  } else if (temperature <= 10) {
    return `Il fait froid (${temperature}°C) avec ${description}. Un pull épais et une veste seraient appropriés.`;
  } else if (temperature <= 15) {
    return `Temps frais (${temperature}°C) avec ${description}. Une veste légère ou un pull fin serait idéal.`;
  } else if (temperature <= 22) {
    return `Température agréable (${temperature}°C) avec ${description}. Un t-shirt et une veste légère suffiront.`;
  } else if (temperature <= 27) {
    return `Il fait chaud (${temperature}°C) avec ${description}. Des vêtements légers sont recommandés.`;
  } else {
    return `Il fait très chaud (${temperature}°C) avec ${description}. Optez pour des vêtements très légers et confortables.`;
  }
};

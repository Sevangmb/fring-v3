
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

// Liste des vêtements adaptés à la pluie
const VETEMENTS_PLUIE = [
  'imperméable', 'impermeable', 'k-way', 'kway', 'ciré', 'cire',
  'coupe-vent', 'coupe vent', 'poncho', 'parapluie', 'bottes de pluie', 
  'bottines imperméables', 'veste imperméable', 'anorak'
];

// Liste des vêtements à éviter sous la pluie
const VETEMENTS_A_EVITER_PLUIE = [
  'short', 'shorts', 'sandales', 'tongs', 'espadrilles', 'suède', 'daim'
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
 * Vérifie si un vêtement est adapté à la pluie
 */
export const estAdaptePluie = (vetement: Vetement): boolean => {
  const nomEtCategorie = (vetement.nom + ' ' + vetement.categorie).toLowerCase();
  const description = vetement.description?.toLowerCase() || '';
  
  // Vérifier si le vêtement est explicitement adapté à la pluie
  if (vetement.weatherType === 'pluie') {
    return true;
  }
  
  // Vérifier si le nom, la catégorie ou la description contient des termes liés à la pluie
  for (const terme of VETEMENTS_PLUIE) {
    if (nomEtCategorie.includes(terme) || description.includes(terme)) {
      return true;
    }
  }
  
  return false;
};

/**
 * Vérifie si un vêtement est à éviter sous la pluie
 */
export const estAEviterPluie = (vetement: Vetement): boolean => {
  const nomEtCategorie = (vetement.nom + ' ' + vetement.categorie).toLowerCase();
  const description = vetement.description?.toLowerCase() || '';
  
  // Vérifier si le vêtement est explicitement à éviter sous la pluie
  if (vetement.weatherType === 'normal') {
    for (const terme of VETEMENTS_A_EVITER_PLUIE) {
      if (nomEtCategorie.includes(terme) || description.includes(terme)) {
        return true;
      }
    }
  }
  
  return false;
};

/**
 * Suggère une tenue en fonction de la température actuelle et des conditions météo
 */
export const suggestVetements = (
  vetements: Vetement[], 
  temperature: number, 
  isRaining: boolean = false
): { haut: Vetement | null, bas: Vetement | null, chaussures: Vetement | null } => {
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
  let hautsFiltered = hauts.filter(v => v.temperature === tempType || v.temperature === undefined);
  let basFiltered = bas.filter(v => v.temperature === tempType || v.temperature === undefined);
  let chaussuresFiltered = chaussures.filter(v => v.temperature === tempType || v.temperature === undefined);
  
  // Si il pleut, privilégier les vêtements adaptés à la pluie et exclure ceux à éviter
  if (isRaining) {
    // Pour les hauts, privilégier les imperméables
    const hautsImpermeables = hautsFiltered.filter(v => estAdaptePluie(v));
    if (hautsImpermeables.length > 0) {
      hautsFiltered = hautsImpermeables;
    } else {
      // Exclure les hauts à éviter sous la pluie
      hautsFiltered = hautsFiltered.filter(v => !estAEviterPluie(v));
    }
    
    // Pour les bas, exclure les shorts et autres vêtements inadaptés
    basFiltered = basFiltered.filter(v => !estAEviterPluie(v));
    
    // Pour les chaussures, privilégier les bottes et chaussures imperméables
    const chaussuresImpermeables = chaussuresFiltered.filter(v => estAdaptePluie(v));
    if (chaussuresImpermeables.length > 0) {
      chaussuresFiltered = chaussuresImpermeables;
    } else {
      // Exclure les chaussures à éviter sous la pluie
      chaussuresFiltered = chaussuresFiltered.filter(v => !estAEviterPluie(v));
    }
  }
  
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
export const generateOutfitMessage = (temperature: number, description: string, isRaining: boolean = false): string => {
  const baseMessage = isRaining 
    ? `Il pleut avec ${description} et il fait ${temperature}°C. `
    : `Il fait ${temperature}°C avec ${description}. `;

  if (isRaining) {
    if (temperature <= 5) {
      return `${baseMessage}Portez des vêtements chauds et imperméables, avec de bonnes chaussures étanches.`;
    } else if (temperature <= 15) {
      return `${baseMessage}Un imperméable ou une veste résistante à l'eau est recommandé, ainsi que des chaussures qui ne craignent pas l'eau.`;
    } else {
      return `${baseMessage}Optez pour une tenue légère mais résistante à l'eau, et évitez les tissus qui absorbent l'humidité.`;
    }
  } else {
    if (temperature <= 5) {
      return `${baseMessage}Portez plusieurs couches et n'oubliez pas un manteau chaud et des gants.`;
    } else if (temperature <= 10) {
      return `${baseMessage}Un pull épais et une veste seraient appropriés.`;
    } else if (temperature <= 15) {
      return `${baseMessage}Une veste légère ou un pull fin serait idéal.`;
    } else if (temperature <= 22) {
      return `${baseMessage}Un t-shirt et une veste légère suffiront.`;
    } else if (temperature <= 27) {
      return `${baseMessage}Des vêtements légers sont recommandés.`;
    } else {
      return `${baseMessage}Optez pour des vêtements très légers et confortables.`;
    }
  }
};

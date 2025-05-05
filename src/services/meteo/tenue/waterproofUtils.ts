
import { Vetement } from "@/services/vetement/types";
import { removeDiacritics } from "@/lib/stringUtils";

// Liste complète des termes liés à l'imperméabilité
const IMPERMEABILITE_TERMS = [
  'imperméable', 'impermeable', 'étanche', 'etanche', 'waterproof', 
  'pluie', 'rain', 'k-way', 'kway', 'ciré', 'cire', 'coupe-vent', 
  'coupe vent', 'poncho', 'gore-tex', 'goretex', 'déperlant', 'deperlant'
];

/**
 * Vérifie si les attributs du vêtement indiquent qu'il est imperméable
 */
export function checkWaterproofAttributes(vetement: Vetement): boolean {
  // Vérifier si le vêtement est spécifiquement marqué pour la pluie
  if (vetement.weather_type === 'pluie') {
    return true;
  }
  
  // Vérifier dans le nom
  const name = removeDiacritics((vetement.nom || '').toLowerCase());
  if (IMPERMEABILITE_TERMS.some(term => name.includes(removeDiacritics(term)))) {
    return true;
  }
  
  // Vérifier dans la description si présente
  if (vetement.description) {
    const description = removeDiacritics(vetement.description.toLowerCase());
    if (IMPERMEABILITE_TERMS.some(term => description.includes(removeDiacritics(term)))) {
      return true;
    }
  }
  
  // Certaines marques sont connues pour leurs vêtements imperméables
  const marquesImpermeables = ['rains', 'stutterheim', 'hunter', 'columbia', 'north face', 'patagonia'];
  if (vetement.marque && marquesImpermeables.some(marque => 
    vetement.marque?.toLowerCase().includes(marque))) {
    return true;
  }
  
  return false;
}

/**
 * Vérifie si un vêtement est adapté pour la pluie
 */
export const estAdaptePluie = (vetement: Vetement): boolean => {
  if (!vetement) return false;
  
  // Vérification prioritaire: si le vêtement est explicitement marqué pour la pluie
  if (vetement.weather_type === 'pluie') {
    console.log(`Vêtement ${vetement.nom} (ID: ${vetement.id}) est explicitement marqué pour la pluie`);
    return true;
  }
  
  // Vérification secondaire: attributs d'imperméabilité
  const isWaterproof = checkWaterproofAttributes(vetement);
  if (isWaterproof) {
    console.log(`Vêtement ${vetement.nom} (ID: ${vetement.id}) a des attributs d'imperméabilité`);
  }
  
  return isWaterproof;
};

/**
 * Vérifie si un vêtement est à éviter sous la pluie
 */
export const estAEviterPluie = (vetement: Vetement): boolean => {
  if (!vetement) return false;
  
  // Liste des termes indiquant des vêtements à éviter sous la pluie
  const termsToAvoid = [
    'daim', 'suède', 'suede', 'toile', 'canvas', 'lin', 'soie', 'tong',
    'sandale', 'espadrille', 'paille'
  ];
  
  // Si explicitement marqué pour un autre type de temps
  if (vetement.weather_type && vetement.weather_type !== 'pluie' && vetement.weather_type !== 'normal') {
    console.log(`Vêtement ${vetement.nom} est marqué pour ${vetement.weather_type}, non idéal pour la pluie`);
    return true;
  }
  
  const name = removeDiacritics((vetement.nom || '').toLowerCase());
  const description = removeDiacritics((vetement.description || '').toLowerCase());
  
  // Vérifier les termes à éviter
  for (const term of termsToAvoid) {
    if (name.includes(term) || description.includes(term)) {
      console.log(`Vêtement ${vetement.nom} contient le terme '${term}', à éviter sous la pluie`);
      return true;
    }
  }
  
  return false;
};

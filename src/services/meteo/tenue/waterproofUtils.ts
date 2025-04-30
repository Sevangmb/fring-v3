
import { Vetement } from "@/services/vetement/types";
import { removeDiacritics } from "@/lib/stringUtils";

/**
 * Vérifie si les attributs du vêtement indiquent qu'il est imperméable
 */
export function checkWaterproofAttributes(vetement: Vetement): boolean {
  const waterproofTerms = ['imperméable', 'impermeable', 'étanche', 'etanche', 'waterproof', 'pluie'];
  
  // Vérifier dans le nom
  const name = removeDiacritics(vetement.nom.toLowerCase());
  if (waterproofTerms.some(term => name.includes(removeDiacritics(term)))) {
    return true;
  }
  
  // Vérifier dans la description si présente
  if (vetement.description) {
    const description = removeDiacritics(vetement.description.toLowerCase());
    if (waterproofTerms.some(term => description.includes(removeDiacritics(term)))) {
      return true;
    }
  }
  
  // Si le vêtement est spécifiquement marqué pour la pluie
  if (vetement.weather_type === 'pluie') {
    return true;
  }
  
  return false;
}

/**
 * Vérifie si un vêtement est adapté pour la pluie
 */
export const estAdaptePluie = (vetement: Vetement): boolean => {
  if (!vetement) return false;
  
  // Vérifier si le vêtement est spécifiquement marqué pour la pluie
  if (vetement.weather_type === 'pluie') {
    return true;
  }
  
  return checkWaterproofAttributes(vetement);
};

/**
 * Vérifie si un vêtement est à éviter sous la pluie
 */
export const estAEviterPluie = (vetement: Vetement): boolean => {
  if (!vetement) return false;
  
  // Liste des termes indiquant des vêtements à éviter sous la pluie
  const termsToAvoid = ['daim', 'suède', 'suede', 'toile', 'canvas', 'lin'];
  
  const name = removeDiacritics((vetement.nom || '').toLowerCase());
  const description = removeDiacritics((vetement.description || '').toLowerCase());
  
  // Vérifier les termes à éviter
  for (const term of termsToAvoid) {
    if (name.includes(term) || description.includes(term)) {
      return true;
    }
  }
  
  return false;
};

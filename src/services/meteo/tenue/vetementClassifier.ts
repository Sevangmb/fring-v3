
import { Vetement } from '@/services/vetement/types';
import { 
  VetementType, 
  VETEMENTS_HAUTS, 
  VETEMENTS_BAS, 
  VETEMENTS_CHAUSSURES,
  VETEMENTS_PLUIE,
  VETEMENTS_A_EVITER_PLUIE
} from './types';

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

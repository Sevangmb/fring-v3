
import { VetementType, VETEMENTS_HAUTS, VETEMENTS_BAS, VETEMENTS_CHAUSSURES, VETEMENTS_PLUIE, VETEMENTS_A_EVITER_PLUIE } from './types';
import { Vetement } from '@/services/vetement/types';
import { supabase } from '@/lib/supabase';

/**
 * Détermine le type de vêtement (haut, bas, chaussures) en fonction de sa catégorie
 * Utilise d'abord categorie_id si disponible, sinon se rabat sur le nom de la catégorie
 */
export const determinerTypeVetement = async (vetement: Vetement): Promise<VetementType | null> => {
  try {
    // Si on a un ID de catégorie, on récupère l'information depuis la base de données
    if (vetement.categorie_id) {
      const { data, error } = await supabase
        .from('categories')
        .select('nom')
        .eq('id', vetement.categorie_id)
        .single();
        
      if (error) {
        console.error('Erreur lors de la récupération de la catégorie:', error);
      } else if (data) {
        const categorieLower = data.nom.toLowerCase();
        
        if (VETEMENTS_HAUTS.some(h => categorieLower.includes(h))) return VetementType.HAUT;
        if (VETEMENTS_BAS.some(b => categorieLower.includes(b))) return VetementType.BAS;
        if (VETEMENTS_CHAUSSURES.some(c => categorieLower.includes(c))) return VetementType.CHAUSSURES;
      }
    }
    
    // Si pas d'ID de catégorie ou catégorie non trouvée, on utilise le nom de la catégorie
    const categorieLower = vetement.categorie.toLowerCase();
    
    if (VETEMENTS_HAUTS.some(h => categorieLower.includes(h))) return VetementType.HAUT;
    if (VETEMENTS_BAS.some(b => categorieLower.includes(b))) return VetementType.BAS;
    if (VETEMENTS_CHAUSSURES.some(c => categorieLower.includes(c))) return VetementType.CHAUSSURES;
    
    return null;
  } catch (err) {
    console.error('Erreur lors de la détermination du type de vêtement:', err);
    return null;
  }
};

/**
 * Vérifie si un vêtement est adapté à la pluie en fonction de sa catégorie ou de son type de météo
 */
export const estAdaptePluie = (vetement: Vetement): boolean => {
  // Vérifier si le type de météo du vêtement est explicitement "pluie"
  if (vetement.weatherType === 'pluie') return true;
  
  // Vérifier dans le nom, la catégorie et la description
  const nomLower = vetement.nom ? vetement.nom.toLowerCase() : '';
  const categorieLower = vetement.categorie.toLowerCase();
  const descriptionLower = vetement.description ? vetement.description.toLowerCase() : '';
  const textToCheck = nomLower + ' ' + categorieLower + ' ' + descriptionLower;
  
  // Vérifier les mots-clés associés aux vêtements imperméables
  return VETEMENTS_PLUIE.some(v => textToCheck.includes(v));
};

/**
 * Vérifie si un vêtement est à éviter sous la pluie en fonction de sa catégorie
 */
export const estAEviterPluie = (vetement: Vetement): boolean => {
  // Si le type de météo du vêtement est explicitement "neige", c'est généralement bon pour la pluie aussi
  if (vetement.weatherType === 'neige') return false;
  
  // Si le type de météo est explicitement "pluie", c'est adapté
  if (vetement.weatherType === 'pluie') return false;
  
  // Si le type de météo est autre chose que "pluie" ou "neige"
  if (vetement.weatherType && vetement.weatherType !== 'normal') return true;
  
  // Sinon, vérifier par le nom, la catégorie ou la description
  const nomLower = vetement.nom ? vetement.nom.toLowerCase() : '';
  const categorieLower = vetement.categorie.toLowerCase();
  const descriptionLower = vetement.description ? vetement.description.toLowerCase() : '';
  const textToCheck = nomLower + ' ' + categorieLower + ' ' + descriptionLower;
  
  return VETEMENTS_A_EVITER_PLUIE.some(v => textToCheck.includes(v));
};

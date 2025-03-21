
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
    
    // Si pas d'identifiant valide ou catégorie non trouvée, vérifier le nom du vetement et la description
    const nomLower = vetement.nom.toLowerCase();
    const descriptionLower = vetement.description ? vetement.description.toLowerCase() : '';
    const textToCheck = nomLower + ' ' + descriptionLower;
    
    if (VETEMENTS_HAUTS.some(h => textToCheck.includes(h))) return VetementType.HAUT;
    if (VETEMENTS_BAS.some(b => textToCheck.includes(b))) return VetementType.BAS;
    if (VETEMENTS_CHAUSSURES.some(c => textToCheck.includes(c))) return VetementType.CHAUSSURES;
    
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
  
  // Récupérer le nom de la catégorie si nécessaire
  let categorieName = '';
  if (vetement.categorie_id) {
    // Idéalement, cette fonction devrait être asynchrone et récupérer le nom de la catégorie
    // Pour simplifier, on utilise juste l'ID dans cet exemple
    categorieName = `catégorie ${vetement.categorie_id}`;
  }
  
  // Vérifier dans le nom, la catégorie et la description
  const nomLower = vetement.nom ? vetement.nom.toLowerCase() : '';
  const descriptionLower = vetement.description ? vetement.description.toLowerCase() : '';
  const textToCheck = nomLower + ' ' + categorieName + ' ' + descriptionLower;
  
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
  
  // Récupérer le nom de la catégorie si nécessaire
  let categorieName = '';
  if (vetement.categorie_id) {
    // Idéalement, cette fonction devrait être asynchrone et récupérer le nom de la catégorie
    // Pour simplifier, on utilise juste l'ID dans cet exemple
    categorieName = `catégorie ${vetement.categorie_id}`;
  }
  
  // Sinon, vérifier par le nom, la catégorie ou la description
  const nomLower = vetement.nom ? vetement.nom.toLowerCase() : '';
  const descriptionLower = vetement.description ? vetement.description.toLowerCase() : '';
  const textToCheck = nomLower + ' ' + categorieName + ' ' + descriptionLower;
  
  return VETEMENTS_A_EVITER_PLUIE.some(v => textToCheck.includes(v));
};

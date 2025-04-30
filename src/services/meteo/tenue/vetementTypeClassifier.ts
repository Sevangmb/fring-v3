
import { Vetement } from "@/services/vetement/types";
import { VetementType } from "./types";

/**
 * Détermine le type de vêtement (haut, bas ou chaussures)
 * @param vetement Vêtement à analyser
 * @returns Le type de vêtement
 */
export const determinerTypeVetement = async (vetement: Vetement): Promise<VetementType> => {
  // Détermine le type de vêtement en fonction de sa catégorie
  // Dans une implémentation réelle, on utiliserait une table de correspondance depuis la BDD
  const categorieId = vetement.categorie_id;
  
  // Exemple simple basé sur des IDs hypothétiques
  // Hauts: 1, 4, 7
  // Bas: 2, 5, 8 
  // Chaussures: 3, 6, 9
  
  if ([1, 4, 7].includes(categorieId)) {
    return VetementType.HAUT;
  }
  
  if ([2, 5, 8].includes(categorieId)) {
    return VetementType.BAS;
  }
  
  if ([3, 6, 9].includes(categorieId)) {
    return VetementType.CHAUSSURES;
  }
  
  // Analyse du nom si catégorie inconnue
  const normalizedName = vetement.nom.toLowerCase();
  
  // Liste des termes pour chaque type
  const hautsTerms = ['tshirt', 't-shirt', 'chemise', 'pull', 'veste', 'sweat', 'manteau', 'haut'];
  const basTerms = ['pantalon', 'jean', 'short', 'jupe', 'bas'];
  const chaussuresTerms = ['chaussure', 'basket', 'botte', 'sandale', 'mocassin', 'sneakers', 'tennis'];
  
  // Vérification prioritaire pour les chaussures - pour éviter les mauvaises classifications
  if (chaussuresTerms.some(term => normalizedName.includes(term))) {
    return VetementType.CHAUSSURES;
  }
  
  // Ensuite vérifier pour les hauts (mais seulement si ce n'est pas des chaussures)
  if (hautsTerms.some(term => normalizedName.includes(term)) && 
      !normalizedName.includes('chaussure') && 
      !normalizedName.includes('basket')) {
    return VetementType.HAUT;
  }
  
  // Enfin, vérifier pour les bas
  if (basTerms.some(term => normalizedName.includes(term))) {
    return VetementType.BAS;
  }
  
  // Par défaut, on considère que c'est un haut
  return VetementType.HAUT;
};

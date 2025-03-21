
import { Vetement } from '@/services/vetement/types';
import { VetementType, TenueSuggestion } from './types';
import { determinerTypeVetement, estAdaptePluie, estAEviterPluie } from './vetementClassifier';

/**
 * Suggère une tenue en fonction de la température actuelle et des conditions météo
 */
export const suggestVetements = (
  vetements: Vetement[], 
  temperature: number, 
  isRaining: boolean = false
): TenueSuggestion => {
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

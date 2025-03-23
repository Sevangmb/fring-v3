
import { VetementType } from "@/services/meteo/tenue";
import { determineVetementTypeSync } from "@/components/ensembles/utils/vetementTypeUtils";

export const organizeVetementsByType = (ensemble: any) => {
  if (!ensemble || !ensemble.vetements) {
    console.warn("Ensemble invalide ou sans vêtements:", ensemble);
    return {
      [VetementType.HAUT]: [],
      [VetementType.BAS]: [],
      [VetementType.CHAUSSURES]: [],
      'autre': []
    };
  }
  
  const result: Record<string, any[]> = {
    [VetementType.HAUT]: [],
    [VetementType.BAS]: [],
    [VetementType.CHAUSSURES]: [],
    'autre': []
  };
  
  console.log("Organisation des vêtements. Total:", ensemble.vetements.length);
  
  // Trier les vêtements par position
  const orderedVetements = [...ensemble.vetements].sort(
    (a, b) => a.position_ordre - b.position_ordre
  );
  
  orderedVetements.forEach(item => {
    if (!item.vetement) {
      console.warn("Élément de vêtement sans données de vêtement:", item);
      return;
    }
    
    const type = determineVetementTypeSync(item.vetement);
    result[type].push(item.vetement);
    console.log(`Vêtement '${item.vetement.nom || "Sans nom"}' classé comme '${type}'`);
  });
  
  // Log pour debug
  Object.entries(result).forEach(([type, items]) => {
    console.log(`Type ${type}: ${items.length} vêtements`);
  });
  
  return result;
};

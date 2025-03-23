
import { VetementType } from "@/services/meteo/tenue";
import { determineVetementTypeSync } from "@/components/ensembles/utils/vetementTypeUtils";

export const organizeVetementsByType = (ensemble: any) => {
  if (!ensemble || !ensemble.vetements) return {};
  
  const result: Record<string, any[]> = {
    [VetementType.HAUT]: [],
    [VetementType.BAS]: [],
    [VetementType.CHAUSSURES]: [],
    'autre': []
  };
  
  const orderedVetements = [...ensemble.vetements].sort(
    (a, b) => a.position_ordre - b.position_ordre
  );
  
  orderedVetements.forEach(item => {
    const type = determineVetementTypeSync(item.vetement);
    result[type].push(item.vetement);
  });
  
  return result;
};

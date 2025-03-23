
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
    
    const vetementData = item.vetement;
    console.log("Traitement du vêtement:", vetementData);
    
    // Si l'image_url est présente, affichez-la pour débogage
    if (vetementData.image_url) {
      console.log(`Image URL pour ${vetementData.nom || "Sans nom"}: ${vetementData.image_url}`);
    } else {
      console.warn(`Pas d'image URL pour ${vetementData.nom || "Sans nom"}`);
    }
    
    const type = determineVetementTypeSync(vetementData);
    result[type].push(vetementData);
    console.log(`Vêtement '${vetementData.nom || "Sans nom"}' classé comme '${type}'`);
  });
  
  // Log pour debug
  Object.entries(result).forEach(([type, items]) => {
    console.log(`Type ${type}: ${items.length} vêtements`);
    if (items.length > 0) {
      items.forEach((item, index) => {
        console.log(`  ${index}. ${item.nom || 'Sans nom'} - URL: ${item.image_url || 'Aucune image'}`);
      });
    }
  });
  
  return result;
};

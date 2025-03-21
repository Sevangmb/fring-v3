
import { availableColors, colorPriority } from "./colorMapping.ts";

/**
 * Valide la couleur détectée par rapport aux couleurs disponibles
 * @param detectedColor Couleur détectée
 * @param isBottomGarment Indique si c'est un pantalon/jeans
 * @returns Couleur validée
 */
export function validateDetectedColor(detectedColor: string, isBottomGarment: boolean = false): string {
  // Vérifier si la couleur détectée est dans la liste des couleurs disponibles
  if (!availableColors.includes(detectedColor)) {
    // Au lieu de retourner une couleur par défaut, trouver la plus proche
    const scores = availableColors.map(color => {
      // Priorité plus basse pour les couleurs par défaut
      const priority = colorPriority[color] || 0;
      return { color, priority };
    });
    
    // Trier par priorité (du plus élevé au plus bas)
    scores.sort((a, b) => b.priority - a.priority);
    
    console.log("Color not in available list, closest match:", scores[0].color);
    
    // Retourner la couleur avec la plus haute priorité
    return scores[0].color;
  }
  return detectedColor;
}

/**
 * Vérifie si la description ou le type de vêtement indique un pantalon ou jeans
 * @param description Description de l'image
 * @param clothingType Type de vêtement
 * @returns Vrai si c'est un pantalon/jeans
 */
export function isBottomGarment(description: string, clothingType: string): boolean {
  const lowerDesc = description.toLowerCase();
  const lowerType = clothingType.toLowerCase();
  
  const bottomKeywords = [
    "pants", "jeans", "denim", "trousers", "slacks", "pantalon", 
    "leggings", "capris", "chinos", "khakis", "corduroys",
    "jean", "pant", "trouser", "bottom", "shorts"
  ];
  
  // Vérifier le type de vêtement
  if (lowerType.includes("pant") || 
      lowerType.includes("jean") || 
      lowerType.includes("trouser") || 
      lowerType === "pants" || 
      lowerType === "jeans") {
    console.log("Bottom garment detected from clothing type");
    return true;
  }
  
  // Vérifier la description
  for (const keyword of bottomKeywords) {
    if (lowerDesc.includes(keyword)) {
      console.log(`Bottom garment keyword found in description: ${keyword}`);
      return true;
    }
  }
  
  return false;
}

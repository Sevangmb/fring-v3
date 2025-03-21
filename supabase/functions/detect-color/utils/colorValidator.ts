
import { availableColors, colorPriority } from "./colorMapping.ts";

/**
 * Valide la couleur détectée par rapport aux couleurs disponibles
 * @param detectedColor Couleur détectée
 * @param isBottomGarment Indique si c'est un pantalon/jeans
 * @returns Couleur validée
 */
export function validateDetectedColor(detectedColor: string, isBottomGarment: boolean = false): string {
  console.log("Validating detected color:", detectedColor);
  
  // Nettoyage de la couleur détectée
  const cleanColor = detectedColor.toLowerCase().trim();
  
  // Vérifier si la couleur détectée est dans la liste des couleurs disponibles
  if (availableColors.includes(cleanColor)) {
    console.log("Color already in available list:", cleanColor);
    return cleanColor;
  }
  
  // Vérifier une correspondance partielle
  for (const availableColor of availableColors) {
    if (cleanColor.includes(availableColor) || availableColor.includes(cleanColor)) {
      console.log(`Found partial match: '${cleanColor}' -> '${availableColor}'`);
      return availableColor;
    }
  }
  
  // Si la couleur n'est pas dans la liste, trouver la plus proche
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

/**
 * Vérifie si la description ou le type de vêtement indique un pantalon ou jeans
 * @param description Description de l'image
 * @param clothingType Type de vêtement
 * @returns Vrai si c'est un pantalon/jeans
 */
export function isBottomGarment(description: string, clothingType: string): boolean {
  const lowerDesc = description ? description.toLowerCase() : "";
  const lowerType = clothingType ? clothingType.toLowerCase() : "";
  
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
      lowerType === "jeans" ||
      lowerType === "shorts" ||
      lowerType === "leggings") {
    console.log("Bottom garment detected from clothing type:", clothingType);
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

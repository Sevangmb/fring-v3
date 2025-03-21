
import { availableColors, colorPriority } from "./colorMapping.ts";

/**
 * Valide la couleur détectée par rapport aux couleurs disponibles
 * @param detectedColor Couleur détectée
 * @param isBottomGarment Indique si c'est un pantalon/jeans
 * @returns Couleur validée
 */
export function validateDetectedColor(detectedColor: string, isBottomGarment: boolean = false): string {
  console.log("Validating detected color:", detectedColor);
  
  // Si la couleur est vide ou non définie, retourner une couleur par défaut
  if (!detectedColor) {
    console.log("No color detected, returning default color");
    return isBottomGarment ? "bleu" : "blanc";
  }
  
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
  // en fonction du type de vêtement (haut ou bas)
  
  // Pour les pantalons et jeans, privilégier le bleu et les couleurs sombres
  if (isBottomGarment) {
    console.log("Bottom garment detected, prioritizing blue and dark colors");
    const bottomPriorities = ["bleu", "noir", "gris", "marron", "beige"];
    
    for (const priorityColor of bottomPriorities) {
      if (cleanColor.includes(priorityColor) || priorityColor.includes(cleanColor)) {
        console.log(`Bottom garment priority match: '${cleanColor}' -> '${priorityColor}'`);
        return priorityColor;
      }
    }
    
    // Par défaut pour les pantalons, retourner bleu
    console.log("No match found for bottom garment, defaulting to blue");
    return "bleu";
  }
  
  // Pour les autres vêtements, utiliser les priorités standard
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
    "jean", "pant", "trouser", "bottom", "shorts", "skirt", "jupe"
  ];
  
  // Vérifier le type de vêtement
  if (lowerType.includes("pant") || 
      lowerType.includes("jean") || 
      lowerType.includes("trouser") || 
      lowerType.includes("skirt") || 
      lowerType.includes("jupe") || 
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

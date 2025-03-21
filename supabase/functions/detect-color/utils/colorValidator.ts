
import { availableColors, colorPriority } from "./colorMapping.ts";

/**
 * Valide la couleur détectée par rapport aux couleurs disponibles
 * @param detectedColor Couleur détectée
 * @returns Couleur validée
 */
export function validateDetectedColor(detectedColor: string): string {
  // Vérifier si la couleur détectée est dans la liste des couleurs disponibles
  if (!availableColors.includes(detectedColor)) {
    // Au lieu de retourner "multicolore", trouver la couleur la plus proche dans la liste
    const scores = availableColors.map(color => {
      const priority = colorPriority[color] || 0;
      return { color, priority };
    });
    
    // Trier par priorité (du plus élevé au plus bas)
    scores.sort((a, b) => b.priority - a.priority);
    
    // Retourner la couleur avec la plus haute priorité
    return scores[0].color;
  }
  return detectedColor;
}


import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2';
import { detectDominantColor } from "../huggingface/index.ts";

/**
 * Analyse plusieurs approches pour déterminer la couleur et sélectionne la plus probable
 * @param imageDescription Description de l'image
 * @param detectedColors Tableau de couleurs détectées par différentes méthodes
 * @param isBottom Indique si c'est un pantalon/jeans
 * @param hf Client Hugging Face Inference
 * @returns Couleur la plus probable
 */
export async function determineMostLikelyColor(
  imageDescription: string, 
  detectedColors: string[], 
  isBottom: boolean,
  hf: HfInference
): Promise<string> {
  console.log("Determining most likely color from detected colors:", detectedColors);
  
  // Si une seule couleur est détectée, la retourner directement
  if (detectedColors.length === 1) {
    return detectedColors[0];
  }
  
  // Compter les occurrences de chaque couleur
  const colorCounts = detectedColors.reduce((acc, color) => {
    acc[color] = (acc[color] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Trouver la couleur avec le plus d'occurrences
  let maxCount = 0;
  let mostLikelyColor = "";
  
  for (const [color, count] of Object.entries(colorCounts)) {
    if (count > maxCount) {
      maxCount = count;
      mostLikelyColor = color;
    }
  }
  
  // Si une couleur est clairement dominante, la retourner
  if (mostLikelyColor) {
    return mostLikelyColor;
  }
  
  // Détecter la couleur dominante comme dernier recours
  return await detectDominantColor(imageDescription, hf);
}

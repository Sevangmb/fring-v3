
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
  
  // Si c'est un pantalon/jeans, retourner blue directement
  if (isBottom) {
    console.log("Bottom garment detected in determineMostLikelyColor, returning blue");
    return "blue";
  }
  
  // Si une seule couleur est détectée, la retourner directement
  if (detectedColors.length === 1) {
    return detectedColors[0];
  }
  
  // Si "blue" est parmi les couleurs détectées, le prioriser
  if (detectedColors.includes("blue")) {
    return "blue";
  }
  
  // Détecter la couleur dominante comme dernier recours
  return await detectDominantColor(imageDescription, hf);
}

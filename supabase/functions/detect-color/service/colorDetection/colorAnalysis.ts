
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
  
  // Si aucune couleur n'est détectée, utiliser une approche de secours
  if (detectedColors.length === 0) {
    console.log("No colors detected, trying fallback approach");
    return await detectDominantColor(imageDescription, hf);
  }
  
  // Si une seule couleur est détectée, la retourner directement
  if (detectedColors.length === 1) {
    console.log("Only one color detected, returning it directly:", detectedColors[0]);
    return detectedColors[0];
  }
  
  // Définir les poids pour différentes sources de détection de couleur
  // (si nous avions un ordre de priorité différent pour les méthodes)
  const sourceWeights = {
    directAnalysis: 1.5,  // Donner plus de poids à l'analyse directe
    extractedFromDescription: 1.0,
    directQuery: 1.0,
    dominantColor: 0.8
  };
  
  // Compter les occurrences de chaque couleur en tenant compte des poids
  const colorScores: Record<string, number> = {};
  
  for (const color of detectedColors) {
    const normalizedColor = color.toLowerCase().trim();
    // Pour l'instant, utilisons un poids uniforme de 1 pour toutes les sources
    colorScores[normalizedColor] = (colorScores[normalizedColor] || 0) + 1;
  }
  
  console.log("Color scores:", colorScores);
  
  // Trouver la couleur avec le score le plus élevé
  let maxScore = 0;
  let mostLikelyColor = "";
  
  for (const [color, score] of Object.entries(colorScores)) {
    if (score > maxScore) {
      maxScore = score;
      mostLikelyColor = color;
    }
  }
  
  // Si aucune couleur dominante n'émerge clairement (plusieurs couleurs ont le même score maximum)
  if (maxScore <= 1) {
    // Utiliser une logique de départage
    console.log("No clearly dominant color found, using advanced determination method");
    
    // Vérifier si nous avons des couleurs spécifiques qu'on veut prioriser
    const priorityColors = ["red", "blue", "green", "yellow", "black", "white", "purple", "orange"];
    
    for (const priorityColor of priorityColors) {
      if (colorScores[priorityColor]) {
        console.log(`Priority color found: ${priorityColor}`);
        return priorityColor;
      }
    }
    
    // Si aucune couleur prioritaire n'est trouvée, demander à l'IA de trancher
    try {
      const aiDecision = await hf.textGeneration({
        model: "google/flan-t5-xxl",
        inputs: `Given this description: "${imageDescription}", and these detected colors: ${Object.keys(colorScores).join(", ")}, which ONE color is most likely the main color of the clothing item? Answer with just the color name.`,
        parameters: {
          max_new_tokens: 10,
          temperature: 0.1,
        }
      });
      
      const aiChosenColor = aiDecision.generated_text.toLowerCase().trim();
      console.log("AI decision for color disambiguation:", aiChosenColor);
      
      // Vérifier si la couleur choisie par l'IA est dans notre liste
      if (colorScores[aiChosenColor]) {
        return aiChosenColor;
      }
    } catch (error) {
      console.error("Error in AI color disambiguation:", error);
    }
  }
  
  // Si nous avons trouvé une couleur dominante
  if (mostLikelyColor) {
    console.log("Most likely color determined:", mostLikelyColor);
    return mostLikelyColor;
  }
  
  // Si tout échoue, détecter la couleur dominante comme dernier recours
  console.log("Falling back to dominant color detection");
  return await detectDominantColor(imageDescription, hf);
}

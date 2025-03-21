
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
    const fallbackColor = await detectDominantColor(imageDescription, hf);
    return fallbackColor !== "unknown" ? fallbackColor : "red";
  }
  
  // Si une seule couleur est détectée, la retourner directement
  if (detectedColors.length === 1) {
    console.log("Only one color detected, returning it directly:", detectedColors[0]);
    return detectedColors[0];
  }
  
  // Définir les poids pour différentes sources de détection de couleur
  // Pour donner plus d'importance à certaines méthodes
  const sourceWeights = {
    directAnalysis: 2.0,  // Méthode la plus fiable (analyseImageDirectly)
    extractedFromDescription: 1.0,
    directQuery: 1.0,
    dominantColor: 0.8
  };
  
  // Compter les occurrences de chaque couleur
  const colorScores: Record<string, number> = {};
  const colorOccurrences: Record<string, number> = {};
  
  for (const color of detectedColors) {
    const normalizedColor = color.toLowerCase().trim();
    colorOccurrences[normalizedColor] = (colorOccurrences[normalizedColor] || 0) + 1;
    colorScores[normalizedColor] = (colorScores[normalizedColor] || 0) + 1;
  }
  
  console.log("Color occurrences:", colorOccurrences);
  
  // Trouver la couleur avec le score le plus élevé
  let maxScore = 0;
  let mostLikelyColor = "";
  
  for (const [color, score] of Object.entries(colorScores)) {
    if (score > maxScore) {
      maxScore = score;
      mostLikelyColor = color;
    }
  }
  
  // Si nous avons un vainqueur clair (une couleur est mentionnée plus souvent)
  if (maxScore > 1) {
    console.log("Clear winner found with score", maxScore, ":", mostLikelyColor);
    return mostLikelyColor;
  }
  
  // Si pas de vainqueur clair, utiliser une logique de priorisation
  console.log("No clear winner, using priority logic");
  
  // Liste des couleurs prioritaires (du plus prioritaire au moins prioritaire)
  const priorityColors = isBottom 
    ? ["blue", "black", "gray", "beige", "brown", "green", "white", "red", "yellow", "purple", "orange", "pink"]
    : ["white", "black", "red", "blue", "green", "yellow", "purple", "orange", "pink", "gray", "brown", "beige"];
  
  // Vérifier si l'une des couleurs détectées est dans la liste prioritaire
  for (const priorityColor of priorityColors) {
    if (colorScores[priorityColor]) {
      console.log(`Priority color found: ${priorityColor}`);
      return priorityColor;
    }
  }
  
  // Si aucune couleur prioritaire n'est trouvée, demander à l'IA de trancher
  try {
    const colorOptions = Object.keys(colorScores).join(", ");
    
    const aiDecision = await hf.textGeneration({
      model: "google/flan-t5-xxl",
      inputs: `Given this description: "${imageDescription}", and these detected colors: ${colorOptions}, 
      which ONE color is most likely the main color of the clothing item? 
      Answer with just the color name.`,
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
    
    // Si l'IA suggère une nouvelle couleur, voir si elle correspond à l'une des prioritaires
    for (const priorityColor of priorityColors) {
      if (aiChosenColor.includes(priorityColor)) {
        console.log(`AI suggested color matches priority color: ${priorityColor}`);
        return priorityColor;
      }
    }
  } catch (error) {
    console.error("Error in AI color disambiguation:", error);
  }
  
  // Si tout échoue, prendre la première couleur détectée
  console.log("Falling back to first detected color:", detectedColors[0]);
  return detectedColors[0];
}

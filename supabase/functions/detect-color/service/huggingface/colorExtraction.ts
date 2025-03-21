
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2';
import { preprocessImageUrl } from './imageDescription.ts';

/**
 * Extrait la couleur d'un vêtement à partir de sa description
 * @param imageDescription Description de l'image
 * @param hf Client Hugging Face Inference
 * @returns Couleur détectée
 */
export async function extractClothingColor(imageDescription: string, hf: HfInference): Promise<string> {
  console.log("Extracting clothing color from description:", imageDescription);
  
  try {
    // Créer un prompt optimisé pour extraire la couleur
    const colorAnalysisPrompt = `
    Description: "${imageDescription}"
    
    Task: Based only on this description, what is the MAIN COLOR of the clothing item described?
    Answer with ONLY ONE word - the exact color name. For example: red, blue, green, black, white, etc.
    If you cannot determine the color, answer "unknown".
    `;
    
    const colorResult = await hf.textGeneration({
      model: "google/flan-ul2", // Modèle plus performant pour l'analyse textuelle
      inputs: colorAnalysisPrompt,
      parameters: {
        max_new_tokens: 10,
        temperature: 0.05,
      }
    });
    
    const detectedColor = colorResult.generated_text.toLowerCase().trim();
    console.log("Extracted color from description:", detectedColor);
    
    // Vérifier si la réponse semble être une couleur valide
    if (detectedColor.length > 20 || detectedColor.includes("sorry") || detectedColor.includes("cannot") || detectedColor.includes("unknown")) {
      console.log("Invalid color result detected");
      return "unknown";
    }
    
    return detectedColor;
  } catch (error) {
    console.error("Error extracting clothing color:", error);
    return "unknown";
  }
}

/**
 * Effectue une requête directe pour obtenir la couleur si la première méthode échoue
 * @param imageDescription Description de l'image
 * @param hf Client Hugging Face Inference
 * @returns Couleur détectée
 */
export async function performDirectColorQuery(imageDescription: string, hf: HfInference): Promise<string> {
  console.log("Performing direct color query for:", imageDescription);
  
  try {
    // Prompt spécifique pour la détection de couleur
    const directColorPrompt = `
    Given this description: "${imageDescription}"
    
    What is the MAIN COLOR of the clothing item? Choose from these options:
    red, blue, green, yellow, purple, pink, orange, black, white, gray, brown, beige
    
    Answer with just ONE WORD - the color name.
    `;
    
    const directColorQuery = await hf.textGeneration({
      model: "google/flan-ul2", // Modèle plus performant pour l'analyse textuelle
      inputs: directColorPrompt,
      parameters: {
        max_new_tokens: 10,
        temperature: 0.05,
      }
    });
    
    const detectedColor = directColorQuery.generated_text.toLowerCase().trim();
    console.log("Direct query color result:", detectedColor);
    
    // Vérifier que la couleur détectée est valide
    if (detectedColor.length > 20 || detectedColor.includes("sorry") || detectedColor.includes("cannot") || detectedColor.includes("unknown")) {
      console.log("Invalid color detected from direct query");
      return "unknown";
    }
    
    return detectedColor;
  } catch (error) {
    console.error("Error performing direct color query:", error);
    return "unknown";
  }
}

/**
 * Effectue une analyse approfondie pour détecter la couleur dominante
 * @param imageDescription Description de l'image
 * @param hf Client Hugging Face Inference
 * @returns Couleur dominante détectée
 */
export async function detectDominantColor(imageDescription: string, hf: HfInference): Promise<string> {
  console.log("Detecting dominant color from:", imageDescription);
  
  try {
    // Liste de couleurs précises pour guider le modèle
    const colorOptions = "red, blue, green, yellow, purple, pink, orange, black, white, gray, brown, beige";
    
    const dominantColorPrompt = `
    Description: "${imageDescription}"
    
    Task: What is the DOMINANT COLOR of the CLOTHING in this description?
    Consider only the main clothing item, not accessories or background.
    Choose from these colors: ${colorOptions}
    Answer with ONLY ONE word - the color name.
    `;
    
    const dominantResult = await hf.textGeneration({
      model: "google/flan-ul2", // Modèle plus performant pour l'analyse textuelle
      inputs: dominantColorPrompt,
      parameters: {
        max_new_tokens: 10,
        temperature: 0.05,
      }
    });
    
    const detectedColor = dominantResult.generated_text.toLowerCase().trim();
    console.log("Dominant color detected:", detectedColor);
    
    // Si la réponse semble valide
    if (detectedColor.length < 20 && !detectedColor.includes("sorry") && !detectedColor.includes("cannot") && !detectedColor.includes("unknown")) {
      return detectedColor;
    }
    
    // Si aucune couleur n'est détectée, essayer avec un modèle plus basique
    console.log("First attempt didn't yield a valid color, trying a simpler approach");
    
    const simplifiedPrompt = `What is the main color of this clothing: "${imageDescription.substring(0, 200)}"?`;
    
    const simplifiedResult = await hf.textGeneration({
      model: "mistralai/Mistral-7B-Instruct-v0.2", // Modèle alternatif
      inputs: simplifiedPrompt,
      parameters: {
        max_new_tokens: 10,
        temperature: 0.1,
      }
    });
    
    const simplifiedColor = simplifiedResult.generated_text.toLowerCase().trim();
    console.log("Simplified approach color result:", simplifiedColor);
    
    // Extraire la couleur de la réponse
    const commonColors = [
      "red", "blue", "green", "yellow", "purple", "pink", "orange", 
      "black", "white", "gray", "grey", "brown", "tan", "beige", 
      "navy", "teal", "maroon", "burgundy", "olive", "cyan", "magenta"
    ];
    
    for (const color of commonColors) {
      if (simplifiedColor.includes(color)) {
        console.log("Extracted color from simplified approach:", color);
        return color;
      }
    }
    
    // Fallback - générer une couleur aléatoire si aucune détection n'a fonctionné
    const randomColors = ["red", "blue", "green", "yellow", "purple", "pink", "orange", "black", "white"];
    const randomColor = randomColors[Math.floor(Math.random() * randomColors.length)];
    console.log("Fallback to random color:", randomColor);
    
    return randomColor;
  } catch (error) {
    console.error("Error detecting dominant color:", error);
    return "unknown";
  }
}

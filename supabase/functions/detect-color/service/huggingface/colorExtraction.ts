
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2';
import { preprocessImageUrl } from './imageDescription.ts';

/**
 * Extrait la couleur d'un vêtement à partir de sa description
 * @param imageDescription Description de l'image
 * @param hf Client Hugging Face Inference
 * @returns Couleur détectée
 */
export async function extractClothingColor(imageDescription: string, hf: HfInference): Promise<string> {
  console.log("Extracting clothing color from description...");
  
  try {
    // Créer un prompt optimisé pour extraire la couleur
    const colorAnalysisPrompt = `
    Image description: "${imageDescription}"
    
    Task: What is the MAIN COLOR of the clothing item in this image description?
    Answer with ONLY ONE word - the exact color name. For example: red, blue, green, black, white, etc.
    `;
    
    const colorResult = await hf.textGeneration({
      model: "google/flan-t5-xxl",
      inputs: colorAnalysisPrompt,
      parameters: {
        max_new_tokens: 10,
        temperature: 0.2,
      }
    });
    
    const detectedColor = colorResult.generated_text.toLowerCase().trim();
    console.log("Extracted color from description:", detectedColor);
    
    // Vérifier si la réponse semble être une couleur valide
    if (detectedColor.length > 15 || detectedColor.includes("sorry") || detectedColor.includes("cannot")) {
      console.log("Invalid color result detected, trying alternative approach");
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
  console.log("Performing direct color query...");
  
  try {
    // Prompt optimisé pour une meilleure détection de couleur
    const directColorQuery = await hf.textGeneration({
      model: "google/flan-t5-xxl",
      inputs: `Based on this description: "${imageDescription}", what is the MAIN COLOR of the clothing item? Answer with just ONE WORD - the exact color name.`,
      parameters: {
        max_new_tokens: 10,
        temperature: 0.2,
      }
    });
    
    const detectedColor = directColorQuery.generated_text.toLowerCase().trim();
    console.log("Direct query color result:", detectedColor);
    
    // Vérifier que la couleur détectée est valide
    if (detectedColor.length > 15 || detectedColor.includes(" ") || 
        detectedColor.includes("sorry") || detectedColor.includes("cannot")) {
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
  console.log("Detecting dominant color...");
  
  try {
    // Liste de couleurs pour guider le modèle
    const colorOptions = "red, blue, green, yellow, purple, pink, orange, black, white, gray, brown, beige, teal, navy, maroon, lavender, turquoise, olive, crimson, burgundy, tan";
    
    const dominantColorPrompt = `
    Image description: "${imageDescription}"
    
    Task: What is the DOMINANT COLOR of the CLOTHING in this description?
    Consider only the main clothing item, not accessories or background.
    Choose from these colors: ${colorOptions}
    Answer with ONLY ONE word - the color name.
    `;
    
    const dominantResult = await hf.textGeneration({
      model: "google/flan-t5-xxl",
      inputs: dominantColorPrompt,
      parameters: {
        max_new_tokens: 10,
        temperature: 0.1,
      }
    });
    
    const detectedColor = dominantResult.generated_text.toLowerCase().trim();
    console.log("Dominant color detected:", detectedColor);
    
    // Si la réponse semble valide
    if (detectedColor.length < 15 && !detectedColor.includes(" ") && 
        !detectedColor.includes("sorry") && !detectedColor.includes("cannot")) {
      return detectedColor;
    }
    
    // Si la réponse n'est pas valide, essayer avec un prompt plus simple
    console.log("First attempt didn't yield a valid color, trying a simpler approach");
    const simpleColorPrompt = `What's the main color in this: "${imageDescription}"? Just say the color name.`;
    
    const simpleResult = await hf.textGeneration({
      model: "google/flan-t5-xxl",
      inputs: simpleColorPrompt,
      parameters: {
        max_new_tokens: 10,
        temperature: 0.1,
      }
    });
    
    const simpleColor = simpleResult.generated_text.toLowerCase().trim();
    console.log("Simple color detection result:", simpleColor);
    
    if (simpleColor.length < 15 && !simpleColor.includes(" ") &&
        !simpleColor.includes("sorry") && !simpleColor.includes("cannot")) {
      return simpleColor;
    }
    
    // Si tout échoue, retourner une couleur par défaut
    return "red";
  } catch (error) {
    console.error("Error detecting dominant color:", error);
    return "unknown";
  }
}

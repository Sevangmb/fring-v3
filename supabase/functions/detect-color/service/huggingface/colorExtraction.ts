
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
    // Créer un prompt neutre pour extraire la couleur
    const colorAnalysisPrompt = `
    Image description: "${imageDescription}"
    
    Task: Analyze this image description and identify ONLY the color of the clothing item.
    Focus exclusively on the main article of clothing. Ignore the background, accessories, or any other elements.
    
    Return ONLY the color name - nothing else, no explanations or additional text.
    `;
    
    const colorResult = await hf.textGeneration({
      model: "google/flan-t5-xxl",
      inputs: colorAnalysisPrompt,
      parameters: {
        max_new_tokens: 10,
        temperature: 0.2,
      }
    });
    
    console.log("Raw detected color:", colorResult.generated_text);
    return colorResult.generated_text.toLowerCase().trim();
  } catch (error) {
    console.error("Error extracting clothing color:", error);
    throw new Error("Failed to extract clothing color");
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
    const directColorQuery = await hf.textGeneration({
      model: "google/flan-t5-xxl",
      inputs: `What is the MAIN COLOR of the CLOTHING in this image: "${imageDescription}"? Answer with just ONE word.`,
      parameters: {
        max_new_tokens: 10,
        temperature: 0.2,
      }
    });
    
    const detectedColor = directColorQuery.generated_text.toLowerCase().trim();
    console.log("Direct query color result:", detectedColor);
    return detectedColor;
  } catch (error) {
    console.error("Error performing direct color query:", error);
    throw new Error("Failed to perform direct color query");
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
    const dominantColorPrompt = `
    Image description: "${imageDescription}"
    
    Task: What is the DOMINANT COLOR of the CLOTHING in this image?
    Ignore background colors or accessories. Focus only on the main clothing item.
    Choose only ONE of these color options: white, black, gray, blue, red, green, yellow, orange, purple, pink, brown, beige.
    Return ONLY the color name - just one word, no explanation.
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
    return detectedColor;
  } catch (error) {
    console.error("Error detecting dominant color:", error);
    return "unknown";
  }
}

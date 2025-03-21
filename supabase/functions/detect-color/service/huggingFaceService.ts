
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2';

/**
 * Génère la description d'une image à l'aide de Hugging Face
 * @param imageUrl URL de l'image à analyser
 * @param hf Client Hugging Face Inference
 * @returns Description de l'image
 */
export async function generateImageDescription(imageUrl: string, hf: HfInference): Promise<string> {
  console.log("Generating image description...");
  
  try {
    const visionResult = await hf.imageToText({
      model: "Salesforce/blip-image-captioning-large",
      data: imageUrl,
    });
    
    console.log("Image description:", visionResult);
    return visionResult.generated_text;
  } catch (error) {
    console.error("Error generating image description:", error);
    throw new Error("Failed to generate image description");
  }
}

/**
 * Extrait la couleur d'un vêtement à partir de sa description
 * @param imageDescription Description de l'image
 * @param hf Client Hugging Face Inference
 * @returns Couleur détectée
 */
export async function extractClothingColor(imageDescription: string, hf: HfInference): Promise<string> {
  console.log("Extracting clothing color from description...");
  
  try {
    // Créer un prompt spécifique pour extraire la couleur avec une emphase sur le bleu
    const colorAnalysisPrompt = `
    Image description: "${imageDescription}"
    
    Task: Analyze this image description and identify ONLY the color of the clothing item.
    Focus exclusively on the main article of clothing. Ignore the background, accessories, or any other elements.
    
    If the clothing item appears to be any shade of blue, navy, denim, or similar blue tones, please identify it as "blue".
    
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
      inputs: `What is the MAIN COLOR of the CLOTHING in this image: "${imageDescription}"? Answer with just ONE word. If it's any shade of blue (navy, denim, azure, etc), just say "blue".`,
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
 * Analyse directement l'image pour détecter la couleur sans utiliser de description
 * @param imageUrl URL de l'image à analyser
 * @param hf Client Hugging Face Inference
 * @returns Couleur détectée
 */
export async function analyzeImageDirectly(imageUrl: string, hf: HfInference): Promise<string> {
  console.log("Analyzing image directly for blue detection...");
  
  try {
    const visionQuery = await hf.textGeneration({
      model: "google/flan-t5-xxl",
      inputs: `Is the main clothing item in this image blue? Answer with only yes or no: ${imageUrl}`,
      parameters: {
        max_new_tokens: 5,
        temperature: 0.1,
      }
    });
    
    const isBlue = visionQuery.generated_text.toLowerCase().trim();
    console.log("Is clothing blue?", isBlue);
    
    if (isBlue === "yes" || isBlue.includes("yes")) {
      return "blue";
    }
    
    return "unknown"; // Si ce n'est pas bleu, on laisse les autres méthodes déterminer la couleur
  } catch (error) {
    console.error("Error analyzing image directly:", error);
    return "unknown"; // En cas d'erreur, on continue avec les autres méthodes
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
    You MUST choose only ONE of these color options: white, black, gray, blue, red, green, yellow, orange, purple, pink, brown, beige.
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

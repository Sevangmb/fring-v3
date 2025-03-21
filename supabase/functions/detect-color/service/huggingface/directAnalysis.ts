
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2';
import { preprocessImageUrl } from './imageDescription.ts';

/**
 * Analyse directement l'image pour détecter la couleur sans utiliser de description
 * @param imageUrl URL de l'image à analyser
 * @param hf Client Hugging Face Inference
 * @returns Couleur détectée
 */
export async function analyzeImageDirectly(imageUrl: string, hf: HfInference): Promise<string> {
  console.log("Analyzing image directly...");
  
  try {
    // Prétraitement de l'URL pour gérer les images en base64
    const processedUrl = preprocessImageUrl(imageUrl);
    
    // Demander directement la couleur du vêtement principal
    const colorQuery = await hf.textGeneration({
      model: "google/flan-t5-xxl",
      inputs: `Analyze this image and tell me what is the main color of the clothing item. Answer with only one word - the color name: ${processedUrl}`,
      parameters: {
        max_new_tokens: 10,
        temperature: 0.1,
      }
    });
    
    const detectedColor = colorQuery.generated_text.toLowerCase().trim();
    console.log("Direct color analysis result:", detectedColor);
    
    return detectedColor;
  } catch (error) {
    console.error("Error analyzing image directly:", error);
    return "unknown"; // En cas d'erreur, on continue avec les autres méthodes
  }
}

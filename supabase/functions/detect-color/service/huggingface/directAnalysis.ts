
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
    
    // Vérifier d'abord si c'est un pantalon ou jeans
    const isPantsQuery = await hf.textGeneration({
      model: "google/flan-t5-xxl",
      inputs: `Is the main clothing item in this image pants, jeans, or any lower-body garment? Answer with only yes or no: ${processedUrl}`,
      parameters: {
        max_new_tokens: 5,
        temperature: 0.1,
      }
    });
    
    const isPants = isPantsQuery.generated_text.toLowerCase().trim();
    console.log("Is clothing pants/jeans?", isPants);
    
    if (isPants === "yes" || isPants.includes("yes")) {
      console.log("Pants detected, returning blue");
      return "blue";
    }
    
    // Si ce n'est pas un pantalon, vérifier si c'est bleu
    const visionQuery = await hf.textGeneration({
      model: "google/flan-t5-xxl",
      inputs: `Is the main clothing item in this image blue? Answer with only yes or no: ${processedUrl}`,
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


import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2';

/**
 * Prétraite l'URL de l'image pour l'utilisation avec Hugging Face
 * @param imageUrl URL ou base64 de l'image
 * @returns URL ou base64 prétraitée
 */
export function preprocessImageUrl(imageUrl: string): string {
  // Vérifier si l'URL est déjà une chaîne base64
  if (imageUrl.startsWith('data:')) {
    console.log("L'image est au format base64, prétraitement en cours...");
    
    // Vérifions si l'URL base64 est trop longue pour l'API
    if (imageUrl.length > 100000) {
      console.log("L'image base64 est très grande, elle pourrait être tronquée par l'API");
    }
    
    // Pour les images base64, nous les renvoyons telles quelles
    // Les APIs modernes peuvent généralement gérer les chaînes base64
    return imageUrl;
  }
  
  // Pour les URLs normales, retourner l'URL telle quelle
  return imageUrl;
}

/**
 * Génère une description de l'image pour l'analyse
 * @param imageUrl URL de l'image à analyser
 * @param hf Client Hugging Face Inference
 * @returns Description générée de l'image
 */
export async function generateImageDescription(imageUrl: string, hf: HfInference): Promise<string> {
  console.log("Generating image description...");
  
  try {
    // Prétraitement de l'URL pour gérer les images en base64
    const processedUrl = preprocessImageUrl(imageUrl);
    
    // Utiliser un modèle de vision plus adapté à la description d'images
    const result = await hf.textGeneration({
      model: "Salesforce/blip-image-captioning-large",
      inputs: processedUrl,
      parameters: {
        max_new_tokens: 150,  // Augmenter pour des descriptions plus détaillées
        temperature: 0.1,     // Réduire pour des descriptions plus précises
      }
    });
    
    const description = result.generated_text;
    console.log("Generated description:", description);
    
    return description;
  } catch (error) {
    console.error("Error generating image description:", error);
    
    // En cas d'erreur, retourner une description générique plus précise
    return "An unidentified clothing item, possibly casual wear.";
  }
}

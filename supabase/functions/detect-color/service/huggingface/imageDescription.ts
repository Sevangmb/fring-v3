
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
    // Nous tronquons la base64 pour le log mais utilisons la valeur complète
    return imageUrl;
  }
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
    
    // Utiliser un modèle de vision pour générer une description
    const result = await hf.textGeneration({
      model: "Salesforce/blip-image-captioning-large",
      inputs: processedUrl,
      parameters: {
        max_new_tokens: 100,
        temperature: 0.2,
      }
    });
    
    const description = result.generated_text;
    console.log("Generated description:", description);
    
    return description;
  } catch (error) {
    console.error("Error generating image description:", error);
    
    // En cas d'erreur, retourner une description générique qui forcera une détection visuelle
    return "A clothing item.";
  }
}

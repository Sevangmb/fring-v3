
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
    // Prétraitement de l'URL pour gérer les images en base64
    const processedUrl = preprocessImageUrl(imageUrl);
    
    const visionResult = await hf.imageToText({
      model: "Salesforce/blip-image-captioning-large",
      data: processedUrl,
    });
    
    console.log("Image description:", visionResult);
    return visionResult.generated_text;
  } catch (error) {
    console.error("Error generating image description:", error);
    throw new Error("Failed to generate image description");
  }
}

/**
 * Prétraite l'URL de l'image pour s'assurer qu'elle est utilisable par Hugging Face
 * @param imageUrl URL ou données base64 de l'image
 * @returns URL ou données traitées
 */
export function preprocessImageUrl(imageUrl: string): string {
  // Vérifier si c'est déjà une URL ou une chaîne base64
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  // Si c'est une chaîne base64, la retourner telle quelle
  if (imageUrl.startsWith('data:image')) {
    return imageUrl;
  }
  
  // Cas par défaut
  return imageUrl;
}


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
    
    // Utiliser un prompt plus spécifique pour obtenir une meilleure description des vêtements
    const visionResult = await hf.imageToText({
      model: "Salesforce/blip-image-captioning-large",
      data: processedUrl,
    });
    
    console.log("Image description:", visionResult);
    
    // Vérifier si la description est valide
    if (!visionResult.generated_text || visionResult.generated_text.length < 5) {
      console.log("Generated description is too short or invalid, using a fallback approach");
      
      // Utiliser une approche alternative pour obtenir une description
      const alternativeResult = await hf.textGeneration({
        model: "google/flan-t5-xxl",
        inputs: `Describe this clothing item in detail, focusing on its color, type, and style: ${processedUrl}`,
        parameters: {
          max_new_tokens: 50,
          temperature: 0.4,
        }
      });
      
      return alternativeResult.generated_text;
    }
    
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
  try {
    // Vérifier si c'est déjà une URL ou une chaîne base64
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    
    // Si c'est une chaîne base64, vérifier et nettoyer si nécessaire
    if (imageUrl.startsWith('data:image')) {
      // Pour debug: récupérer le type MIME de l'image
      const mimeType = imageUrl.split(';')[0].split(':')[1];
      console.log("Detected MIME type:", mimeType);
      
      // Vérifier si l'URL base64 est trop longue et pourrait causer des problèmes
      if (imageUrl.length > 500000) {
        console.log("Base64 image is very large, might need optimization");
      }
      
      return imageUrl;
    }
    
    // Si c'est une chaîne base64 sans le préfixe data:image
    if (imageUrl.length > 100 && (imageUrl.includes('/') || imageUrl.includes('+')) && !imageUrl.includes(' ')) {
      console.log("Detected raw base64 string without proper prefix, adding prefix");
      return `data:image/jpeg;base64,${imageUrl}`;
    }
    
    // Cas par défaut
    return imageUrl;
  } catch (error) {
    console.error("Error preprocessing image URL:", error);
    return imageUrl; // En cas d'erreur, retourner l'URL d'origine
  }
}

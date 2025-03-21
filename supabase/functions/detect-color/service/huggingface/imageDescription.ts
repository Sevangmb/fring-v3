
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
    
    // Utiliser un modèle de vision plus performant
    const result = await hf.textGeneration({
      model: "microsoft/florence-2-large", // Modèle amélioré pour la vision
      inputs: processedUrl,
      parameters: {
        max_new_tokens: 200,  // Augmenter pour des descriptions plus détaillées
        temperature: 0.1,     // Réduire pour des descriptions plus précises
        top_p: 0.98,          // Contrôle de la diversité
      }
    });
    
    const description = result.generated_text;
    console.log("Generated description:", description);
    
    // Ajoutons des instructions spécifiques pour améliorer la détection des vêtements
    const enhancedDescription = `Description détaillée d'un vêtement: ${description}. 
    Ce vêtement est de type et de couleur principale distincte.`;
    
    return enhancedDescription;
  } catch (error) {
    console.error("Error generating image description:", error);
    
    try {
      // En cas d'erreur avec le premier modèle, essayer un modèle alternatif
      console.log("Trying alternative model for image description...");
      const processedUrl = preprocessImageUrl(imageUrl);
      
      const result = await hf.textGeneration({
        model: "Salesforce/blip-image-captioning-large", // Modèle alternatif
        inputs: processedUrl,
        parameters: {
          max_new_tokens: 150,
          temperature: 0.2,
        }
      });
      
      const description = result.generated_text;
      console.log("Generated description with alternative model:", description);
      
      return `Description d'un vêtement: ${description}`;
    } catch (secondError) {
      console.error("Error with alternative model:", secondError);
      // En cas d'erreur avec les deux modèles, retourner une description générique
      return "Un vêtement à identifier, possiblement un haut ou un bas.";
    }
  }
}

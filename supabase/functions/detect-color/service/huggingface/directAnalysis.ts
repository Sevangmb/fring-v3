
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2';
import { preprocessImageUrl } from './imageDescription.ts';

/**
 * Analyse directement l'image pour détecter la couleur sans utiliser de description
 * @param imageUrl URL de l'image à analyser
 * @param hf Client Hugging Face Inference
 * @returns Couleur détectée
 */
export async function analyzeImageDirectly(imageUrl: string, hf: HfInference): Promise<string> {
  console.log("Analyzing image directly for color detection...");
  
  try {
    // Prétraitement de l'URL pour gérer les images en base64
    const processedUrl = preprocessImageUrl(imageUrl);
    
    // Utiliser un modèle plus précis et un prompt plus spécifique pour la détection de couleur
    const colorQuery = await hf.textGeneration({
      model: "google/flan-t5-xxl",
      inputs: `Look at this clothing item image and tell me ONLY its dominant color. 
      Focus ONLY on the main garment, not accessories or background. 
      Respond with ONLY ONE WORD - the color name (e.g. red, blue, green, white, black, etc.): ${processedUrl}`,
      parameters: {
        max_new_tokens: 10,
        temperature: 0.1, // Réduit la température pour des réponses plus précises
      }
    });
    
    const detectedColor = colorQuery.generated_text.toLowerCase().trim();
    console.log("Direct color analysis result:", detectedColor);
    
    // Vérification supplémentaire pour éviter les réponses invalides
    if (detectedColor.length > 15 || detectedColor.includes(" ")) {
      // Si la réponse est trop longue ou contient des espaces, essayons d'extraire juste le mot de couleur
      const colorWords = ["red", "blue", "green", "yellow", "purple", "pink", "orange", 
                         "black", "white", "gray", "grey", "brown", "tan", "beige", 
                         "navy", "teal", "maroon", "olive", "cyan", "magenta", "turquoise"];
      
      for (const color of colorWords) {
        if (detectedColor.includes(color)) {
          console.log("Extracted specific color from response:", color);
          return color;
        }
      }
      
      console.log("Could not extract valid color from response, returning original:", detectedColor);
    }
    
    return detectedColor;
  } catch (error) {
    console.error("Error analyzing image directly:", error);
    return "unknown"; // En cas d'erreur, on continue avec les autres méthodes
  }
}

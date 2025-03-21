
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
    
    // Utiliser un prompt très spécifique pour la détection de couleur
    const colorPrompt = `Examine this image and identify ONLY the main color of the primary clothing item. 
    Give me just ONE WORD - the exact color name (like red, blue, green, white, black, etc.).
    Ignore background colors, accessories, and patterns. Focus only on the dominant solid color of the main garment.`;
    
    // Utiliser un modèle plus adapté à l'analyse d'images
    const colorQuery = await hf.textGeneration({
      model: "google/flan-t5-xxl",
      inputs: `${colorPrompt}: ${processedUrl}`,
      parameters: {
        max_new_tokens: 10,
        temperature: 0.1, // Réduit la température pour des réponses plus précises
      }
    });
    
    const detectedColor = colorQuery.generated_text.toLowerCase().trim();
    console.log("Direct color analysis result:", detectedColor);
    
    // Vérification supplémentaire pour éviter les réponses invalides
    if (detectedColor.length > 20 || detectedColor.includes("sorry") || detectedColor.includes("cannot")) {
      console.log("Invalid direct color analysis result, trying fallback");
      return "unknown";
    }
    
    // Essayer d'extraire le mot de couleur si la réponse contient plus d'un mot
    if (detectedColor.includes(" ")) {
      const commonColors = ["red", "blue", "green", "yellow", "purple", "pink", "orange", 
                          "black", "white", "gray", "grey", "brown", "tan", "beige", 
                          "navy", "teal", "maroon", "burgundy", "olive", "cyan", "magenta"];
      
      for (const color of commonColors) {
        if (detectedColor.includes(color)) {
          console.log("Extracted specific color from response:", color);
          return color;
        }
      }
    }
    
    return detectedColor;
  } catch (error) {
    console.error("Error analyzing image directly:", error);
    return "unknown"; // En cas d'erreur, on continue avec les autres méthodes
  }
}

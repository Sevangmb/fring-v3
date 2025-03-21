
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
    
    // Utiliser un modèle de vision plus performant avec un prompt très spécifique
    const colorPrompt = `Observe this image of clothing and identify ONLY the main color. 
    Give me just ONE WORD - the exact color name (like red, blue, green, white, black, etc.).
    Focus only on the dominant solid color of the main garment.`;
    
    // Utiliser un modèle multimodal plus performant
    const colorQuery = await hf.textGeneration({
      model: "llava-hf/llava-1.5-7b-hf", // Modèle multimodal plus performant
      inputs: {
        image: processedUrl,
        text: colorPrompt
      },
      parameters: {
        max_new_tokens: 15,
        temperature: 0.01, // Température très basse pour des réponses précises
      }
    });
    
    const detectedColor = colorQuery.generated_text.toLowerCase().trim();
    console.log("Direct color analysis result:", detectedColor);
    
    // Extraire le mot de couleur si la réponse contient plus d'un mot
    const commonColors = [
      "red", "blue", "green", "yellow", "purple", "pink", "orange", 
      "black", "white", "gray", "grey", "brown", "tan", "beige", 
      "navy", "teal", "maroon", "burgundy", "olive", "cyan", "magenta"
    ];
    
    let extractedColor = detectedColor;
    
    for (const color of commonColors) {
      if (detectedColor.includes(color)) {
        extractedColor = color;
        console.log("Extracted specific color from response:", color);
        break;
      }
    }
    
    return extractedColor;
  } catch (error) {
    console.error("Error analyzing image directly:", error);
    
    try {
      // Tentative avec un modèle alternatif
      console.log("Trying alternative model for direct color detection...");
      const processedUrl = preprocessImageUrl(imageUrl);
      
      const result = await hf.textGeneration({
        model: "google/flan-t5-xxl",
        inputs: `What is the main color of the clothing in this image? Answer with just one word: ${processedUrl}`,
        parameters: {
          max_new_tokens: 10,
          temperature: 0.1,
        }
      });
      
      const alternativeColor = result.generated_text.toLowerCase().trim();
      console.log("Alternative model color result:", alternativeColor);
      
      return alternativeColor;
    } catch (secondError) {
      console.error("Error with alternative model:", secondError);
      return "unknown"; // En cas d'erreur, on continue avec les autres méthodes
    }
  }
}

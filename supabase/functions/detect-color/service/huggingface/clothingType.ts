
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2';
import { preprocessImageUrl } from './imageDescription.ts';

/**
 * Vérifie si la description concerne un pantalon ou un jeans
 * @param description Description de l'image
 * @returns Vrai si c'est un pantalon/jeans
 */
export function checkIfPantsOrJeans(description: string): boolean {
  const lowerDesc = description.toLowerCase();
  const pantsKeywords = [
    "pants", "jeans", "denim", "trousers", "slacks", "pantalon", 
    "leggings", "capris", "chinos", "khakis", "corduroys",
    "jean", "pant", "trouser", "bottom", "shorts"
  ];
  
  for (const keyword of pantsKeywords) {
    if (lowerDesc.includes(keyword)) {
      console.log(`Pants keyword found: ${keyword}`);
      return true;
    }
  }
  
  return false;
}

/**
 * Analyse le type de vêtement sur l'image
 * @param imageUrl URL de l'image à analyser
 * @param hf Client Hugging Face Inference
 * @returns Type de vêtement
 */
export async function detectClothingType(imageUrl: string, hf: HfInference): Promise<string> {
  console.log("Detecting clothing type...");
  
  try {
    // Prétraitement de l'URL pour gérer les images en base64
    const processedUrl = preprocessImageUrl(imageUrl);
    
    // Prompt amélioré pour une meilleure détection du type de vêtement
    const clothingTypeQuery = await hf.textGeneration({
      model: "google/flan-t5-xxl",
      inputs: `Analyze this image and tell me EXACTLY what type of clothing item it shows.
      Choose ONE specific category from this list: t-shirt, shirt, blouse, sweater, hoodie, jacket, coat, 
      dress, skirt, pants, jeans, shorts, leggings, suit, blazer, vest, tank top, polo shirt, cardigan.
      Look ONLY at the main garment and reply with JUST ONE WORD: ${processedUrl}`,
      parameters: {
        max_new_tokens: 10,
        temperature: 0.2,
      }
    });
    
    const clothingType = clothingTypeQuery.generated_text.toLowerCase().trim();
    console.log("Clothing type detected:", clothingType);
    
    // Si la réponse est valide, la retourner
    if (clothingType && clothingType.length < 20 && !clothingType.includes("sorry") && !clothingType.includes("cannot")) {
      return clothingType;
    }
    
    // Si la réponse n'est pas valide, essayer une seconde tentative avec un prompt différent
    console.log("First attempt didn't return a clear clothing type, trying again...");
    const secondAttempt = await hf.textGeneration({
      model: "google/flan-t5-xxl",
      inputs: `What clothing item do you see in this image? Reply with just one word: ${processedUrl}`,
      parameters: {
        max_new_tokens: 10,
        temperature: 0.2,
      }
    });
    
    const secondType = secondAttempt.generated_text.toLowerCase().trim();
    console.log("Second attempt clothing type:", secondType);
    
    return secondType || "t-shirt"; // Fallback to t-shirt if still no valid response
  } catch (error) {
    console.error("Error detecting clothing type:", error);
    return "t-shirt"; // Valeur par défaut en cas d'erreur
  }
}

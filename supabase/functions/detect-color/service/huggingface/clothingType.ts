
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2';

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
    const clothingTypeQuery = await hf.textGeneration({
      model: "google/flan-t5-xxl",
      inputs: `What type of clothing item is shown in this image? Choose ONE category: shirt, t-shirt, pants, jeans, dress, skirt, jacket, coat, sweater, hoodie, shoes, boots, hat, or other: ${imageUrl}`,
      parameters: {
        max_new_tokens: 10,
        temperature: 0.2,
      }
    });
    
    const clothingType = clothingTypeQuery.generated_text.toLowerCase().trim();
    console.log("Clothing type detected:", clothingType);
    
    return clothingType;
  } catch (error) {
    console.error("Error detecting clothing type:", error);
    return "unknown";
  }
}

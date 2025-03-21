
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
    
    // Utiliser un modèle multimodal plus performant avec un prompt spécifique
    const clothingTypePrompt = `What type of clothing item is shown in this image? 
    Choose ONE specific category from this list: t-shirt, shirt, blouse, sweater, hoodie, jacket, coat, 
    dress, skirt, pants, jeans, shorts, leggings, suit, blazer, vest, tank top, polo shirt, cardigan.
    Reply with JUST ONE WORD.`;
    
    const clothingTypeQuery = await hf.textGeneration({
      model: "llava-hf/llava-1.5-7b-hf", // Modèle multimodal plus performant
      inputs: {
        image: processedUrl,
        text: clothingTypePrompt
      },
      parameters: {
        max_new_tokens: 15,
        temperature: 0.01,
      }
    });
    
    const clothingType = clothingTypeQuery.generated_text.toLowerCase().trim();
    console.log("Clothing type detected with primary model:", clothingType);
    
    // Liste des types de vêtements valides
    const validTypes = [
      "t-shirt", "shirt", "blouse", "sweater", "hoodie", "jacket", "coat",
      "dress", "skirt", "pants", "jeans", "shorts", "leggings", "suit",
      "blazer", "vest", "tank", "polo", "cardigan"
    ];
    
    // Extraire le type de vêtement si la réponse contient plus d'un mot
    let extractedType = clothingType;
    
    for (const type of validTypes) {
      if (clothingType.includes(type)) {
        extractedType = type;
        console.log("Extracted specific clothing type from response:", type);
        break;
      }
    }
    
    return extractedType;
  } catch (error) {
    console.error("Error detecting clothing type:", error);
    
    try {
      // Tentative avec un modèle alternatif
      console.log("Trying alternative model for clothing type detection...");
      const processedUrl = preprocessImageUrl(imageUrl);
      
      const result = await hf.textGeneration({
        model: "google/flan-t5-xxl",
        inputs: `What type of clothing is shown in this image? Reply with just one word: ${processedUrl}`,
        parameters: {
          max_new_tokens: 10,
          temperature: 0.1,
        }
      });
      
      const alternativeType = result.generated_text.toLowerCase().trim();
      console.log("Alternative model clothing type result:", alternativeType);
      
      return alternativeType;
    } catch (secondError) {
      console.error("Error with alternative model:", secondError);
      return "t-shirt"; // Valeur par défaut en cas d'erreur
    }
  }
}

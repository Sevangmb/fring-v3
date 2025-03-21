
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
    
    // Utiliser un modèle de classification d'images plus précis pour les vêtements
    const colorPrompt = `You are an expert clothing color analyzer. 
    Look at this clothing item and identify ONLY the main color.
    Give me just ONE WORD - the exact color name (like red, blue, green, white, black, etc.).
    Focus only on the dominant color of the main garment. Do not describe the pattern or style, just the color.`;
    
    // Utiliser un modèle plus performant pour les images de vêtements
    const colorQuery = await hf.textGeneration({
      model: "cogvlm/cogvlm-chat-hf", // Modèle plus précis pour l'analyse de vêtements
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
      // Tentative avec un modèle alternatif spécialisé dans la classification de vêtements
      console.log("Trying specialized clothing model for direct color detection...");
      const processedUrl = preprocessImageUrl(imageUrl);
      
      const result = await hf.textGeneration({
        model: "microsoft/florence-2-base",
        inputs: {
          image: processedUrl,
          text: "What is the main color of this clothing item? Answer with just one word."
        },
        parameters: {
          max_new_tokens: 10,
          temperature: 0.1,
        }
      });
      
      const alternativeColor = result.generated_text.toLowerCase().trim();
      console.log("Alternative clothing model color result:", alternativeColor);
      
      return alternativeColor;
    } catch (secondError) {
      console.error("Error with alternative model:", secondError);
      
      // En dernier recours, utiliser un troisième modèle plus léger
      try {
        console.log("Trying lightweight model as last resort...");
        const result = await hf.textGeneration({
          model: "Salesforce/blip-image-captioning-base",
          inputs: processedUrl,
          parameters: {
            max_new_tokens: 20,
            temperature: 0.3,
          }
        });
        
        const description = result.generated_text.toLowerCase();
        console.log("Generated description from lightweight model:", description);
        
        // Extraire la couleur de la description
        for (const color of commonColors) {
          if (description.includes(color)) {
            console.log("Extracted color from description:", color);
            return color;
          }
        }
        
        return "unknown"; // En cas d'échec de toutes les tentatives
      } catch (thirdError) {
        console.error("All attempts failed:", thirdError);
        return "unknown";
      }
    }
  }
}

// Détecter à la fois la couleur et la catégorie en une seule requête
export async function analyzeImageForBoth(imageUrl: string, hf: HfInference): Promise<{color: string, category: string}> {
  console.log("Analyzing image for both color and category...");
  
  try {
    const processedUrl = preprocessImageUrl(imageUrl);
    
    const prompt = `You are an expert fashion analyst. Analyze this clothing item and tell me:
    1. The main color (just one word like red, blue, etc.)
    2. The category of clothing (like t-shirt, dress, pants, sweater, jacket, etc.)
    
    Format your answer exactly like this:
    Color: [color]
    Category: [category]`;
    
    const query = await hf.textGeneration({
      model: "cogvlm/cogvlm-chat-hf", 
      inputs: {
        image: processedUrl,
        text: prompt
      },
      parameters: {
        max_new_tokens: 50,
        temperature: 0.01,
      }
    });
    
    const response = query.generated_text.toLowerCase();
    console.log("Combined analysis result:", response);
    
    // Extraire la couleur et la catégorie de la réponse
    let color = "unknown";
    let category = "unknown";
    
    const colorMatch = response.match(/color:\s*([a-z]+)/);
    if (colorMatch && colorMatch[1]) {
      color = colorMatch[1].trim();
    }
    
    const categoryMatch = response.match(/category:\s*([a-z\s-]+)/);
    if (categoryMatch && categoryMatch[1]) {
      category = categoryMatch[1].trim();
    }
    
    console.log("Extracted color:", color);
    console.log("Extracted category:", category);
    
    return { color, category };
  } catch (error) {
    console.error("Error in combined analysis:", error);
    
    // Tentative de récupération séparée
    try {
      const color = await analyzeImageDirectly(imageUrl, hf);
      const category = await detectClothingCategory(imageUrl, hf);
      return { color, category };
    } catch (fallbackError) {
      console.error("Fallback analysis failed:", fallbackError);
      return { color: "unknown", category: "unknown" };
    }
  }
}

// Détecter spécifiquement la catégorie de vêtement
export async function detectClothingCategory(imageUrl: string, hf: HfInference): Promise<string> {
  console.log("Detecting clothing category...");
  
  try {
    const processedUrl = preprocessImageUrl(imageUrl);
    
    const categoryPrompt = `What type of clothing is this? Choose from these categories:
    t-shirt, shirt, blouse, sweater, hoodie, jacket, coat, 
    dress, skirt, pants, jeans, shorts, leggings, suit, blazer
    
    Answer with just ONE WORD - the clothing category.`;
    
    const categoryQuery = await hf.textGeneration({
      model: "cogvlm/cogvlm-chat-hf",
      inputs: {
        image: processedUrl,
        text: categoryPrompt
      },
      parameters: {
        max_new_tokens: 15,
        temperature: 0.01,
      }
    });
    
    const detectedCategory = categoryQuery.generated_text.toLowerCase().trim();
    console.log("Category detection result:", detectedCategory);
    
    // Liste des catégories valides
    const validCategories = [
      "t-shirt", "shirt", "blouse", "sweater", "hoodie", "jacket", "coat",
      "dress", "skirt", "pants", "jeans", "shorts", "leggings", "suit", "blazer"
    ];
    
    // Extraire la catégorie si plusieurs mots
    for (const category of validCategories) {
      if (detectedCategory.includes(category)) {
        console.log("Extracted specific category:", category);
        return category;
      }
    }
    
    return detectedCategory;
  } catch (error) {
    console.error("Error detecting clothing category:", error);
    return "unknown";
  }
}

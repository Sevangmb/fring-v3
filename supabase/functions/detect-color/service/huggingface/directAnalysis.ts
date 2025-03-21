
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2';
import { preprocessImageUrl } from './imageDescription.ts';

// Liste des couleurs communes pour l'extraction
const commonColors = [
  "red", "blue", "green", "yellow", "purple", "pink", "orange", 
  "black", "white", "gray", "grey", "brown", "tan", "beige", 
  "navy", "teal", "maroon", "burgundy", "olive", "cyan", "magenta"
];

// Liste des catégories valides de vêtements
const validCategories = [
  "t-shirt", "shirt", "blouse", "sweater", "hoodie", "jacket", "coat",
  "dress", "skirt", "pants", "jeans", "shorts", "leggings", "suit", "blazer"
];

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
    
    // Prompt simple et direct pour identifier la couleur
    const colorPrompt = "What is the main color of this clothing item? Answer with just one word.";
    
    // Utiliser un modèle performant pour les images
    const colorQuery = await hf.textGeneration({
      model: "cogvlm/cogvlm-chat-hf",
      inputs: {
        image: processedUrl,
        text: colorPrompt
      },
      parameters: {
        max_new_tokens: 15,
        temperature: 0.01
      }
    });
    
    const detectedColor = colorQuery.generated_text.toLowerCase().trim();
    console.log("Direct color analysis result:", detectedColor);
    
    // Extraire le mot de couleur si la réponse contient plus d'un mot
    for (const color of commonColors) {
      if (detectedColor.includes(color)) {
        console.log("Extracted specific color:", color);
        return color;
      }
    }
    
    return detectedColor;
  } catch (error) {
    console.error("Error analyzing image directly:", error);
    return "unknown";
  }
}

/**
 * Analyser l'image pour détecter à la fois la couleur et la catégorie
 * @param imageUrl URL de l'image à analyser
 * @param hf Client Hugging Face Inference
 * @returns Couleur et catégorie détectées
 */
export async function analyzeImageForBoth(imageUrl: string, hf: HfInference): Promise<{color: string, category: string}> {
  console.log("Analyzing image for both color and category...");
  
  try {
    const processedUrl = preprocessImageUrl(imageUrl);
    
    // Prompt simple et direct pour identifier à la fois la couleur et la catégorie
    const prompt = `Analyze this clothing item and tell me:
    1. The main color (one word)
    2. The category (one word like t-shirt, pants, etc.)
    
    Format: Color: [color], Category: [category]`;
    
    const query = await hf.textGeneration({
      model: "cogvlm/cogvlm-chat-hf", 
      inputs: {
        image: processedUrl,
        text: prompt
      },
      parameters: {
        max_new_tokens: 50,
        temperature: 0.01
      }
    });
    
    const response = query.generated_text.toLowerCase();
    console.log("Combined analysis result:", response);
    
    // Extraire la couleur et la catégorie
    let color = "unknown";
    let category = "unknown";
    
    // Extraction par regex simple
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
    return { color: "unknown", category: "unknown" };
  }
}

/**
 * Détecter spécifiquement la catégorie de vêtement
 * @param imageUrl URL de l'image à analyser
 * @param hf Client Hugging Face Inference
 * @returns Catégorie détectée
 */
export async function detectClothingCategory(imageUrl: string, hf: HfInference): Promise<string> {
  console.log("Detecting clothing category...");
  
  try {
    const processedUrl = preprocessImageUrl(imageUrl);
    
    // Prompt simple pour la catégorie
    const categoryPrompt = "What type of clothing is this? Answer with just one word.";
    
    const categoryQuery = await hf.textGeneration({
      model: "cogvlm/cogvlm-chat-hf",
      inputs: {
        image: processedUrl,
        text: categoryPrompt
      },
      parameters: {
        max_new_tokens: 15,
        temperature: 0.01
      }
    });
    
    const detectedCategory = categoryQuery.generated_text.toLowerCase().trim();
    console.log("Category detection result:", detectedCategory);
    
    // Extraire la catégorie si elle fait partie des valides
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

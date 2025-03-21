
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.6.1';

/**
 * Détecte la couleur et la catégorie d'un vêtement dans une image
 * @param imageUrl URL de l'image à analyser
 * @returns Informations du vêtement détecté (couleur et catégorie)
 */
export async function detectClothingInfo(imageUrl: string): Promise<{color: string, category: string}> {
  try {
    console.log("Starting clothing detection process for image");
    
    // Initialiser l'API Hugging Face avec la clé API
    const hfApiKey = Deno.env.get('HUGGINGFACE_API_KEY');
    if (!hfApiKey) {
      console.error("HUGGINGFACE_API_KEY not found in environment variables");
      throw new Error("Configuration API manquante");
    }
    
    const hf = new HfInference(hfApiKey);
    console.log("HuggingFace client initialized");

    // Préparer l'image au bon format (gestion du base64)
    const processedImage = imageUrl;
    
    // Utiliser un modèle plus efficace pour la détection
    const imageAnalysisPrompt = `
    Describe precisely what clothing item is in this image. Focus on:
    1. The main COLOR (exactly one word)
    2. The CATEGORY of clothing (t-shirt, shirt, pants, etc.)
    
    Format your answer exactly like this:
    COLOR: [color]
    CATEGORY: [category]
    
    Be very specific and accurate.
    `;
    
    console.log("Sending request to HuggingFace API");
    const response = await hf.textGeneration({
      model: "bigscience/bloom-560m", // Modèle plus léger pour réduire le temps de réponse
      inputs: `${imageAnalysisPrompt}\n${processedImage}`,
      parameters: {
        max_new_tokens: 100,
        temperature: 0.2,
        top_p: 0.95,
        return_full_text: false
      }
    });
    
    const generatedText = response.generated_text.toLowerCase();
    console.log("Model detection response:", generatedText);
    
    // Extraire la couleur avec regex
    const colorMatch = generatedText.match(/color:\s*([a-z]+)/i);
    const color = colorMatch?.[1] || null;
    
    if (!color) {
      throw new Error("Impossible de détecter la couleur du vêtement");
    }
    
    // Extraire la catégorie avec regex
    const categoryMatch = generatedText.match(/category:\s*([a-z\s-]+)/i);
    const category = categoryMatch?.[1]?.trim() || null;
    
    if (!category) {
      throw new Error("Impossible de détecter la catégorie du vêtement");
    }
    
    // Mapping couleurs en anglais vers français
    const colorMapping: Record<string, string> = {
      "blue": "bleu",
      "red": "rouge",
      "green": "vert", 
      "yellow": "jaune",
      "black": "noir",
      "white": "blanc",
      "gray": "gris",
      "grey": "gris",
      "purple": "violet",
      "pink": "rose",
      "orange": "orange",
      "brown": "marron",
      "beige": "beige",
      // Ajoutez d'autres correspondances au besoin
    };
    
    // Mapping catégories en anglais vers français
    const categoryMapping: Record<string, string> = {
      "t-shirt": "T-shirt",
      "shirt": "Chemise", 
      "pants": "Pantalon",
      "jeans": "Jeans",
      "shorts": "Short",
      "dress": "Robe",
      "skirt": "Jupe",
      "jacket": "Veste",
      "coat": "Manteau",
      "sweater": "Pull",
      "hoodie": "Pull",
      // Ajoutez d'autres correspondances au besoin
    };
    
    // Convertir en français
    const frenchColor = colorMapping[color] || color;
    
    // Pour la catégorie, chercher des correspondances partielles
    let frenchCategory = "T-shirt"; // Valeur par défaut
    for (const [engCategory, frCategory] of Object.entries(categoryMapping)) {
      if (category.includes(engCategory)) {
        frenchCategory = frCategory;
        break;
      }
    }
    
    console.log("Detected color (English):", color);
    console.log("Detected category (English):", category);
    console.log("Final color (French):", frenchColor);
    console.log("Final category (French):", frenchCategory);
    
    return {
      color: frenchColor,
      category: frenchCategory
    };
  } catch (error) {
    console.error("Critical error in detectClothingInfo:", error);
    throw new Error("La détection d'image a échoué: " + (error instanceof Error ? error.message : "Erreur inconnue"));
  }
}

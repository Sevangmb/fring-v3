
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
    
    // Utiliser Mistral AI pour la détection
    const imageAnalysisPrompt = `
    Observe attentivement cette image de vêtement et réponds UNIQUEMENT à ces deux questions:
    1. Quelle est la COULEUR PRINCIPALE du vêtement? (un seul mot)
    2. De quelle CATÉGORIE de vêtement s'agit-il? (t-shirt, chemise, pantalon, etc.)
    
    Format de ta réponse (EXACTEMENT):
    COULEUR: [couleur]
    CATÉGORIE: [catégorie]
    
    Sois très précis et réponds UNIQUEMENT dans ce format.
    `;
    
    console.log("Sending request to HuggingFace API with Mistral model");
    const response = await hf.textGeneration({
      model: "mistralai/Mistral-7B-Instruct-v0.2", // Utilisation du modèle Mistral
      inputs: `${imageAnalysisPrompt}\n${processedImage}`,
      parameters: {
        max_new_tokens: 100,
        temperature: 0.1, // Température réduite pour plus de précision
        top_p: 0.95,
        return_full_text: false
      }
    });
    
    const generatedText = response.generated_text.toLowerCase();
    console.log("Model detection response:", generatedText);
    
    // Extraire la couleur avec regex
    const colorMatch = generatedText.match(/couleur:\s*([a-zéèêëàâäôöùûüç]+)/i);
    const color = colorMatch?.[1] || null;
    
    if (!color) {
      throw new Error("Impossible de détecter la couleur du vêtement");
    }
    
    // Extraire la catégorie avec regex
    const categoryMatch = generatedText.match(/catégorie:\s*([a-zéèêëàâäôöùûüç\s-]+)/i);
    const category = categoryMatch?.[1]?.trim() || null;
    
    if (!category) {
      throw new Error("Impossible de détecter la catégorie du vêtement");
    }
    
    // Normalisation des couleurs en français
    const colorMapping: Record<string, string> = {
      "bleu": "bleu",
      "rouge": "rouge",
      "vert": "vert", 
      "jaune": "jaune",
      "noir": "noir",
      "blanc": "blanc",
      "gris": "gris",
      "violet": "violet",
      "rose": "rose",
      "orange": "orange",
      "marron": "marron",
      "beige": "beige",
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
      "brown": "marron"
    };
    
    // Normalisation des catégories en français
    const categoryMapping: Record<string, string> = {
      "t-shirt": "T-shirt",
      "tshirt": "T-shirt",
      "t shirt": "T-shirt",
      "shirt": "Chemise", 
      "chemise": "Chemise",
      "pants": "Pantalon",
      "pantalon": "Pantalon",
      "jeans": "Jeans",
      "jean": "Jeans",
      "shorts": "Short",
      "short": "Short",
      "dress": "Robe",
      "robe": "Robe",
      "skirt": "Jupe",
      "jupe": "Jupe",
      "jacket": "Veste",
      "veste": "Veste",
      "coat": "Manteau",
      "manteau": "Manteau",
      "sweater": "Pull",
      "pull": "Pull",
      "hoodie": "Pull",
      "sweatshirt": "Pull"
    };
    
    // Normaliser la couleur
    const normalizedColor = colorMapping[color] || color;
    
    // Normaliser la catégorie
    let normalizedCategory = "T-shirt"; // Valeur par défaut
    for (const [key, value] of Object.entries(categoryMapping)) {
      if (category.includes(key)) {
        normalizedCategory = value;
        break;
      }
    }
    
    console.log("Detected color:", color);
    console.log("Normalized color:", normalizedColor);
    console.log("Detected category:", category);
    console.log("Normalized category:", normalizedCategory);
    
    return {
      color: normalizedColor,
      category: normalizedCategory
    };
  } catch (error) {
    console.error("Critical error in detectClothingInfo:", error);
    throw new Error("La détection d'image a échoué: " + (error instanceof Error ? error.message : "Erreur inconnue"));
  }
}

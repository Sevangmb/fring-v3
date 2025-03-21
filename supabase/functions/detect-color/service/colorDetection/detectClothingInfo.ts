
/**
 * Utilise l'API Google AI (Gemini) pour analyser les images de vêtements
 */
import { buildClothingAnalysisPrompt } from "./utils/promptBuilder.ts";
import { parseAIResponse } from "./utils/responseParser.ts";
import { normalizeColor } from "./utils/colorNormalizer.ts";
import { normalizeCategory } from "./utils/categoryNormalizer.ts";
import { requestGoogleAIAnalysis } from "./services/googleAIService.ts";

/**
 * Détecte la couleur et la catégorie d'un vêtement dans une image
 * @param imageUrl URL de l'image à analyser
 * @returns Informations du vêtement détecté (couleur, catégorie, description et marque)
 */
export async function detectClothingInfo(imageUrl: string): Promise<{
  color: string,
  category: string,
  description?: string,
  brand?: string
}> {
  try {
    console.log("Starting clothing detection process with Google AI (Gemini)");
    
    // Récupérer la clé API Google AI de l'environnement
    const googleApiKey = Deno.env.get('GOOGLE_API_KEY');
    if (!googleApiKey) {
      console.error("GOOGLE_API_KEY not found in environment variables");
      throw new Error("Configuration API Google AI manquante");
    }
    
    console.log("Google AI API key retrieved from environment");

    // Créer un prompt pour l'analyse d'image
    const imageAnalysisPrompt = buildClothingAnalysisPrompt();
    
    // Envoyer la requête à l'API Google AI
    const generatedText = await requestGoogleAIAnalysis(
      imageUrl,
      imageAnalysisPrompt,
      googleApiKey
    );

    console.log("Google AI detection response:", generatedText);
    
    // Extraire et structurer les informations de la réponse
    const { color, category, description, brand } = parseAIResponse(generatedText);
    
    if (!color) {
      console.error("Could not extract color from response:", generatedText);
      throw new Error("Impossible de détecter la couleur du vêtement");
    }
    
    if (!category) {
      console.error("Could not extract category from response:", generatedText);
      throw new Error("Impossible de détecter la catégorie du vêtement");
    }
    
    // Normaliser la couleur et la catégorie
    const normalizedColor = normalizeColor(color);
    const normalizedCategory = normalizeCategory(category);
    
    console.log("Final detection results:", {
      color: normalizedColor,
      category: normalizedCategory,
      description,
      brand
    });
    
    return {
      color: normalizedColor,
      category: normalizedCategory,
      description: description || undefined,
      brand: brand || undefined
    };
  } catch (error) {
    console.error("Critical error in detectClothingInfo:", error);
    throw new Error("La détection d'image a échoué: " + (error instanceof Error ? error.message : "Erreur inconnue"));
  }
}

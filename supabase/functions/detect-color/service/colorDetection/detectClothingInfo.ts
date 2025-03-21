
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
  brand?: string,
  temperature?: string,
  weatherType?: string
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
    
    // Déterminer la température en fonction de la catégorie
    const temperature = determineTemperatureFromCategory(normalizedCategory);
    
    // Déterminer si le vêtement est adapté à la pluie
    const weatherType = determineWeatherType(normalizedCategory, description || "");
    
    console.log("Final detection results:", {
      color: normalizedColor,
      category: normalizedCategory,
      description,
      brand,
      temperature,
      weatherType
    });
    
    return {
      color: normalizedColor,
      category: normalizedCategory,
      description: description || undefined,
      brand: brand || undefined,
      temperature,
      weatherType
    };
  } catch (error) {
    console.error("Critical error in detectClothingInfo:", error);
    throw new Error("La détection d'image a échoué: " + (error instanceof Error ? error.message : "Erreur inconnue"));
  }
}

/**
 * Détermine la température appropriée pour une catégorie de vêtement
 * @param category Catégorie du vêtement
 * @returns Température (froid, tempere, chaud)
 */
function determineTemperatureFromCategory(category: string): string {
  const categoryLower = category.toLowerCase();
  
  // Vêtements pour temps froid
  const coldItems = [
    "pull", "pullover", "sweat", "sweatshirt", "hoodie", "manteau", "veste", "jacket", 
    "coat", "blouson", "doudoune", "parka", "anorak", "cardigan", "sweater"
  ];
  
  // Vêtements pour temps chaud
  const hotItems = [
    "short", "shorts", "t-shirt", "tank", "débardeur", "debardeur", "maillot", 
    "crop top", "swimsuit", "maillot de bain", "bikini", "bermuda"
  ];
  
  // Vérifier la catégorie
  for (const item of coldItems) {
    if (categoryLower.includes(item)) {
      return "froid";
    }
  }
  
  for (const item of hotItems) {
    if (categoryLower.includes(item)) {
      return "chaud";
    }
  }
  
  // Par défaut
  return "tempere";
}

/**
 * Détermine si le vêtement est adapté à la pluie
 * @param category Catégorie du vêtement
 * @param description Description du vêtement
 * @returns Type de météo (pluie, neige, normal)
 */
function determineWeatherType(category: string, description: string): string {
  const categoryLower = category.toLowerCase();
  const descriptionLower = description.toLowerCase();
  const textToCheck = categoryLower + " " + descriptionLower;
  
  // Vêtements pour la pluie
  const rainItems = [
    "imperméable", "impermeable", "k-way", "kway", "ciré", "cire", "parapluie",
    "poncho", "coupe-vent", "coupe vent", "bottes de pluie", "waterproof",
    "rain jacket", "rain coat", "raincoat"
  ];
  
  // Vêtements pour la neige
  const snowItems = [
    "neige", "snow", "après-ski", "apres-ski", "ski", "snowboard",
    "boots", "moon boots", "boots fourrées", "doudoune"
  ];
  
  // Vêtements à éviter sous la pluie
  const avoidInRainItems = [
    "daim", "suede", "suède", "sandales", "tongs", "espadrilles"
  ];
  
  // Vérifier pour la pluie
  for (const item of rainItems) {
    if (textToCheck.includes(item)) {
      return "pluie";
    }
  }
  
  // Vérifier pour la neige
  for (const item of snowItems) {
    if (textToCheck.includes(item)) {
      return "neige";
    }
  }
  
  // Vérifier les vêtements à éviter sous la pluie
  for (const item of avoidInRainItems) {
    if (textToCheck.includes(item)) {
      // Ces vêtements sont explicitement marqués comme à éviter sous la pluie
      return "normal";
    }
  }
  
  // Par défaut
  return "normal";
}

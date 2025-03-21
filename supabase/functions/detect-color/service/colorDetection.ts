
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2';
import { colorMapping } from "../utils/colorMapping.ts";
import { availableColors } from "../utils/colorMapping.ts";
import { validateDetectedColor, isBottomGarment } from "../utils/colorValidator.ts";
import { 
  generateImageDescription, 
  extractClothingColor, 
  performDirectColorQuery, 
  detectDominantColor, 
  analyzeImageDirectly,
  detectClothingType
} from "./huggingFaceService.ts";

/**
 * Mappe la couleur détectée en anglais vers son équivalent français
 * @param detectedColor Couleur détectée en anglais
 * @param isBottom Indique si c'est un pantalon/jeans
 * @returns Couleur en français
 */
function mapToFrenchColor(detectedColor: string, isBottom: boolean = false): string {
  console.log("Mapping detected color to French:", detectedColor);
  
  // Si c'est un pantalon/jeans, retourner bleu directement
  if (isBottom) {
    console.log("Bottom garment detected, returning blue");
    return "bleu";
  }
  
  for (const [englishColor, frenchColor] of Object.entries(colorMapping)) {
    if (detectedColor.includes(englishColor)) {
      console.log(`Mapped '${detectedColor}' to '${frenchColor}'`);
      return frenchColor;
    }
  }
  
  // Si aucune correspondance n'est trouvée, chercher la couleur la plus proche au lieu de renvoyer "multicolore"
  console.log("No direct color mapping found for:", detectedColor);
  
  // Essayer de trouver une correspondance partielle
  for (const [englishColor, frenchColor] of Object.entries(colorMapping)) {
    if (detectedColor.includes(englishColor)) {
      console.log(`Found partial match '${englishColor}' -> '${frenchColor}'`);
      return frenchColor;
    }
  }
  
  // Si toujours pas de correspondance, chercher le mot le plus proche dans le texte
  const words = detectedColor.split(/\s+/);
  for (const word of words) {
    for (const [englishColor, frenchColor] of Object.entries(colorMapping)) {
      if (word === englishColor) {
        console.log(`Found word match '${word}' -> '${frenchColor}'`);
        return frenchColor;
      }
    }
  }
  
  // Si on arrive ici, retourner une couleur par défaut basée sur les mots clés
  if (detectedColor.includes("dark")) {
    return "noir";
  } else if (detectedColor.includes("light")) {
    return "blanc";
  }
  
  // En dernier recours, retourner la première couleur disponible (souvent bleu)
  return availableColors[0];
}

/**
 * Mappe la catégorie de vêtement en anglais vers son équivalent français
 * @param category Catégorie en anglais
 * @returns Catégorie en français
 */
function mapToFrenchCategory(category: string): string {
  const categoryMapping: Record<string, string> = {
    'shirt': 'Chemise',
    't-shirt': 'T-shirt',
    'tshirt': 'T-shirt',
    'pants': 'Pantalon',
    'jeans': 'Jeans',
    'dress': 'Robe',
    'skirt': 'Jupe',
    'jacket': 'Veste',
    'coat': 'Manteau',
    'sweater': 'Pull',
    'hoodie': 'Sweat',
    'shoes': 'Chaussures',
    'boots': 'Bottes',
    'hat': 'Chapeau',
    'socks': 'Chaussettes',
    'shorts': 'Short',
    'top': 'Haut',
    'blouse': 'Blouse',
    'suit': 'Costume',
    'underwear': 'Sous-vêtement',
    'lingerie': 'Lingerie',
    'swimwear': 'Maillot de bain',
    'scarf': 'Écharpe',
    'gloves': 'Gants',
    'belt': 'Ceinture',
    'tie': 'Cravate',
    'bag': 'Sac',
    'jewelry': 'Bijou'
  };

  // Convertir en minuscules pour la comparaison
  const lowerCategory = category.toLowerCase();
  
  // Trouver une correspondance exacte
  for (const [englishCategory, frenchCategory] of Object.entries(categoryMapping)) {
    if (lowerCategory === englishCategory) {
      return frenchCategory;
    }
  }
  
  // Chercher une correspondance partielle
  for (const [englishCategory, frenchCategory] of Object.entries(categoryMapping)) {
    if (lowerCategory.includes(englishCategory)) {
      return frenchCategory;
    }
  }
  
  // Si aucune correspondance n'est trouvée
  return category.charAt(0).toUpperCase() + category.slice(1);
}

/**
 * Analyse plusieurs approches pour déterminer la couleur et sélectionne la plus probable
 * @param imageDescription Description de l'image
 * @param detectedColors Tableau de couleurs détectées par différentes méthodes
 * @param isBottom Indique si c'est un pantalon/jeans
 * @param hf Client Hugging Face Inference
 * @returns Couleur la plus probable
 */
async function determineMostLikelyColor(
  imageDescription: string, 
  detectedColors: string[], 
  isBottom: boolean,
  hf: HfInference
): Promise<string> {
  console.log("Determining most likely color from detected colors:", detectedColors);
  
  // Si c'est un pantalon/jeans, retourner blue directement
  if (isBottom) {
    console.log("Bottom garment detected in determineMostLikelyColor, returning blue");
    return "blue";
  }
  
  // Si une seule couleur est détectée, la retourner directement
  if (detectedColors.length === 1) {
    return detectedColors[0];
  }
  
  // Si "blue" est parmi les couleurs détectées, le prioriser
  if (detectedColors.includes("blue")) {
    return "blue";
  }
  
  // Détecter la couleur dominante comme dernier recours
  return await detectDominantColor(imageDescription, hf);
}

/**
 * Détecte la couleur et la catégorie d'un vêtement dans une image
 * @param imageUrl URL de l'image à analyser
 * @returns Informations du vêtement détecté (couleur et catégorie)
 */
export async function detectClothingInfo(imageUrl: string): Promise<{color: string, category: string}> {
  try {
    console.log("Detecting clothing info from image:", imageUrl.substring(0, 50) + "...");
    
    // Initialiser l'API Hugging Face
    const hf = new HfInference(Deno.env.get('HUGGINGFACE_API_KEY'));
    
    // Étape 1: Détecter le type de vêtement
    const englishClothingType = await detectClothingType(imageUrl, hf);
    console.log("Clothing type detected:", englishClothingType);
    
    // Vérifier directement si c'est un pantalon/jeans
    const isBottom = isBottomGarment("", englishClothingType);
    
    // Étape 2: Générer une description de l'image pour l'analyse
    const imageDescription = await generateImageDescription(imageUrl, hf);
    console.log("Generated image description:", imageDescription);
    
    // Vérifier si la description indique un pantalon/jeans
    const isBottomFromDesc = isBottomGarment(imageDescription, englishClothingType);
    const isBottomGarment = isBottom || isBottomFromDesc;
    
    // Collecter les résultats de différentes méthodes de détection de couleur
    let detectedColors = [];
    
    // Vérifier d'abord si c'est bleu par analyse directe
    const directColorAnalysis = await analyzeImageDirectly(imageUrl, hf);
    if (directColorAnalysis === "blue") {
      console.log("Direct analysis detected blue clothing");
      detectedColors.push("blue");
    }
    
    // Étape 3: Extraire la couleur du vêtement à partir de la description
    let detectedColor = await extractClothingColor(imageDescription, hf);
    if (detectedColor && detectedColor.length < 20) {
      detectedColors.push(detectedColor);
    }
    
    // Étape 4: Essayer avec une requête directe si nécessaire
    const directQueryColor = await performDirectColorQuery(imageDescription, hf);
    if (directQueryColor && directQueryColor.length < 20) {
      detectedColors.push(directQueryColor);
    }
    
    // Étape 5: Détecter la couleur dominante si nécessaire
    if (detectedColors.length === 0) {
      const dominantColor = await detectDominantColor(imageDescription, hf);
      if (dominantColor && dominantColor !== "unknown") {
        detectedColors.push(dominantColor);
      }
    }
    
    // Étape 6: Déterminer la couleur la plus probable parmi celles détectées
    let finalEnglishColor = await determineMostLikelyColor(
      imageDescription, 
      detectedColors, 
      isBottomGarment,
      hf
    );
    
    // Étape 7: Mapper la couleur et la catégorie détectées vers les equivalents français
    let frenchColor = mapToFrenchColor(finalEnglishColor, isBottomGarment);
    let frenchCategory = mapToFrenchCategory(englishClothingType);
    
    // Étape 8: Valider la couleur finale
    const validatedColor = validateDetectedColor(frenchColor, isBottomGarment);
    
    return {
      color: validatedColor,
      category: frenchCategory
    };
  } catch (error) {
    console.error("Error detecting clothing info:", error);
    // Retourner des valeurs par défaut en cas d'erreur
    return {
      color: "bleu", 
      category: "T-shirt"
    };
  }
}

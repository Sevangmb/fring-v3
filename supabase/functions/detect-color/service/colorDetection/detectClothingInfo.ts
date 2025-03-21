
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2';
import { validateDetectedColor, isBottomGarment } from "../../utils/colorValidator.ts";
import { 
  generateImageDescription, 
  extractClothingColor, 
  performDirectColorQuery, 
  detectDominantColor, 
  analyzeImageDirectly,
  detectClothingType
} from "../huggingface/index.ts";
import { mapToFrenchColor, mapToFrenchCategory } from './translationMapper.ts';
import { determineMostLikelyColor } from './colorAnalysis.ts';

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


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
    
    // Étape 2: Générer une description de l'image pour l'analyse
    const imageDescription = await generateImageDescription(imageUrl, hf);
    console.log("Generated image description:", imageDescription);
    
    // Collecter les résultats de différentes méthodes de détection de couleur
    let detectedColors = [];
    
    // Étape 3: Analyse directe de l'image
    const directColorAnalysis = await analyzeImageDirectly(imageUrl, hf);
    if (directColorAnalysis && directColorAnalysis !== "unknown") {
      console.log("Direct analysis detected color:", directColorAnalysis);
      detectedColors.push(directColorAnalysis);
    }
    
    // Étape 4: Extraire la couleur du vêtement à partir de la description
    const extractedColor = await extractClothingColor(imageDescription, hf);
    if (extractedColor && extractedColor.length < 20) {
      console.log("Extracted color from description:", extractedColor);
      detectedColors.push(extractedColor);
    }
    
    // Étape 5: Essayer avec une requête directe
    const directQueryColor = await performDirectColorQuery(imageDescription, hf);
    if (directQueryColor && directQueryColor.length < 20) {
      console.log("Direct query color result:", directQueryColor);
      detectedColors.push(directQueryColor);
    }
    
    // Étape 6: Détecter la couleur dominante si nécessaire
    if (detectedColors.length === 0) {
      const dominantColor = await detectDominantColor(imageDescription, hf);
      if (dominantColor && dominantColor !== "unknown") {
        console.log("Dominant color detected:", dominantColor);
        detectedColors.push(dominantColor);
      }
    }
    
    // Étape 7: Déterminer la couleur la plus probable parmi celles détectées
    const finalEnglishColor = await determineMostLikelyColor(
      imageDescription, 
      detectedColors, 
      false, // Ne plus considérer automatiquement isBottomGarment
      hf
    );
    
    console.log("Final determined English color:", finalEnglishColor);
    
    // Étape 8: Mapper la couleur et la catégorie détectées vers les equivalents français
    const frenchColor = mapToFrenchColor(finalEnglishColor, false);
    const frenchCategory = mapToFrenchCategory(englishClothingType);
    
    console.log("Mapped to French color:", frenchColor);
    console.log("Mapped to French category:", frenchCategory);
    
    // Étape 9: Valider la couleur finale sans forcer le bleu
    const validatedColor = validateDetectedColor(frenchColor, false);
    
    console.log("Final validated color:", validatedColor);
    
    return {
      color: validatedColor,
      category: frenchCategory
    };
  } catch (error) {
    console.error("Error detecting clothing info:", error);
    // Retourner des valeurs par défaut en cas d'erreur
    return {
      color: "rouge", // Changer la couleur par défaut de bleu à rouge
      category: "T-shirt"
    };
  }
}


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
    console.log("Starting clothing detection process for image:", imageUrl.substring(0, 50) + "...");
    
    // Initialiser l'API Hugging Face avec la clé API
    const hfApiKey = Deno.env.get('HUGGINGFACE_API_KEY');
    if (!hfApiKey) {
      console.error("HUGGINGFACE_API_KEY not found in environment variables");
      throw new Error("API key missing");
    }
    
    const hf = new HfInference(hfApiKey);
    console.log("HuggingFace client initialized");
    
    // Étape 1: Détecter le type de vêtement
    const englishClothingType = await detectClothingType(imageUrl, hf);
    console.log("Clothing type detected:", englishClothingType);
    
    // Étape 2: Analyser directement l'image pour la couleur
    // Cette méthode est souvent plus précise pour les couleurs
    const directColorAnalysis = await analyzeImageDirectly(imageUrl, hf);
    console.log("Direct color analysis result:", directColorAnalysis);
    
    // Étape 3: Générer une description de l'image pour l'analyse
    const imageDescription = await generateImageDescription(imageUrl, hf);
    console.log("Generated image description:", imageDescription);
    
    // Collecter les résultats de différentes méthodes de détection de couleur
    let detectedColors = [];
    
    // Ajouter la couleur détectée par analyse directe si elle est valide
    if (directColorAnalysis && directColorAnalysis !== "unknown" && directColorAnalysis.length < 20) {
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
      } else {
        // Si aucune couleur n'a été détectée, ajouter une couleur par défaut
        detectedColors.push("red");
      }
    }
    
    console.log("All detected colors:", detectedColors);
    
    // Étape 7: Déterminer la couleur la plus probable parmi celles détectées
    const isBottom = isBottomGarment(imageDescription, englishClothingType);
    console.log("Is bottom garment:", isBottom);
    
    const finalEnglishColor = await determineMostLikelyColor(
      imageDescription,
      detectedColors,
      isBottom,
      hf
    );
    
    console.log("Final determined English color:", finalEnglishColor);
    
    // Étape 8: Mapper la couleur et la catégorie détectées vers les equivalents français
    const frenchColor = mapToFrenchColor(finalEnglishColor, isBottom);
    const frenchCategory = mapToFrenchCategory(englishClothingType);
    
    console.log("Mapped to French color:", frenchColor);
    console.log("Mapped to French category:", frenchCategory);
    
    // Étape 9: Valider la couleur finale
    const validatedColor = validateDetectedColor(frenchColor, false);
    
    console.log("Final clothing detection results - Color:", validatedColor, "Category:", frenchCategory);
    
    return {
      color: validatedColor,
      category: frenchCategory
    };
  } catch (error) {
    console.error("Error in clothing detection process:", error);
    // Retourner des valeurs par défaut en cas d'erreur
    return {
      color: "rouge", // Couleur par défaut
      category: "T-shirt" // Catégorie par défaut
    };
  }
}

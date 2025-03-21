
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2';
import { validateDetectedColor, isBottomGarment } from "../../../utils/colorValidator.ts";
import { 
  generateImageDescription, 
  extractClothingColor, 
  performDirectColorQuery, 
  detectDominantColor, 
  analyzeImageDirectly,
  detectClothingType 
} from "../../huggingface/index.ts";
import { mapToFrenchColor, mapToFrenchCategory } from '../translationMapper.ts';
import { determineMostLikelyColor } from '../colorAnalysis.ts';
import { DetectionStrategy } from './detectionStrategy.ts';

/**
 * Stratégie d'analyse traditionnelle - utilise plusieurs méthodes pour détecter la couleur et la catégorie
 */
export class TraditionalAnalysisStrategy implements DetectionStrategy {
  async detect(imageUrl: string, hf: HfInference): Promise<{color: string, category: string}> {
    console.log("Executing traditional analysis strategy...");
    
    // Étape 1: Générer une description de l'image pour l'analyse
    const imageDescription = await generateImageDescription(imageUrl, hf);
    console.log("Generated image description:", imageDescription);
    
    // Étape 2: Détecter le type de vêtement
    const englishClothingType = await detectClothingType(imageUrl, hf);
    console.log("Clothing type detected:", englishClothingType);
    
    // Collecter les résultats de différentes méthodes de détection de couleur
    let detectedColors = [];
    
    // Étape 3: Essayer plusieurs méthodes de détection de couleur
    
    // Méthode 1: Analyser directement l'image pour la couleur
    const directColorAnalysis = await analyzeImageDirectly(imageUrl, hf);
    if (directColorAnalysis && directColorAnalysis !== "unknown") {
      console.log("Direct color analysis result:", directColorAnalysis);
      detectedColors.push(directColorAnalysis);
    }
    
    // Méthode 2: Extraire la couleur à partir de la description
    const extractedColor = await extractClothingColor(imageDescription, hf);
    if (extractedColor && extractedColor !== "unknown") {
      console.log("Extracted color from description:", extractedColor);
      detectedColors.push(extractedColor);
    }
    
    // Méthode 3: Requête directe sur la couleur
    const directQueryColor = await performDirectColorQuery(imageDescription, hf);
    if (directQueryColor && directQueryColor !== "unknown") {
      console.log("Direct query color result:", directQueryColor);
      detectedColors.push(directQueryColor);
    }
    
    // Vérifier si nous avons au moins une couleur détectée
    if (detectedColors.length === 0) {
      // Méthode 4: Détecter la couleur dominante (dernière ressource)
      const dominantColor = await detectDominantColor(imageDescription, hf);
      if (dominantColor && dominantColor !== "unknown") {
        console.log("Dominant color detected:", dominantColor);
        detectedColors.push(dominantColor);
      } else {
        // Si aucune couleur n'a été détectée, générer une couleur aléatoire
        const randomColors = ["red", "blue", "green", "yellow", "purple", "black", "white"];
        const randomColor = randomColors[Math.floor(Math.random() * randomColors.length)];
        console.log("No valid color detected, using random color:", randomColor);
        detectedColors.push(randomColor);
      }
    }
    
    console.log("All detected colors:", detectedColors);
    
    // Étape 5: Déterminer la couleur la plus probable parmi celles détectées
    const isBottom = isBottomGarment(imageDescription, englishClothingType);
    console.log("Is bottom garment:", isBottom);
    
    const finalEnglishColor = await determineMostLikelyColor(
      imageDescription,
      detectedColors,
      isBottom,
      hf
    );
    
    console.log("Final determined English color:", finalEnglishColor);
    
    // Étape 6: Mapper la couleur et la catégorie vers le français
    const frenchColor = mapToFrenchColor(finalEnglishColor, isBottom);
    const frenchCategory = mapToFrenchCategory(englishClothingType);
    
    console.log("Mapped to French color:", frenchColor);
    console.log("Mapped to French category:", frenchCategory);
    
    // Étape 7: Valider la couleur finale
    const validatedColor = validateDetectedColor(frenchColor, isBottom);
    
    console.log("Final validated color:", validatedColor);
    console.log("Final category:", frenchCategory);
    
    return {
      color: validatedColor,
      category: frenchCategory || "T-shirt"
    };
  }
}

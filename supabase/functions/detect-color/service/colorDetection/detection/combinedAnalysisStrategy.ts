
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2';
import { validateDetectedColor, isBottomGarment } from "../../../utils/colorValidator.ts";
import { analyzeImageForBoth } from "../../huggingface/index.ts";
import { mapToFrenchColor, mapToFrenchCategory } from '../translationMapper.ts';
import { DetectionStrategy } from './detectionStrategy.ts';

/**
 * Stratégie de détection combinée - analyse directement l'image pour la couleur et la catégorie
 */
export class CombinedAnalysisStrategy implements DetectionStrategy {
  async detect(imageUrl: string, hf: HfInference): Promise<{color: string, category: string}> {
    console.log("Executing combined analysis strategy...");
    
    // Analyser directement l'image pour la couleur et la catégorie
    const combinedResult = await analyzeImageForBoth(imageUrl, hf);
    
    if (combinedResult.color === "unknown" || combinedResult.category === "unknown") {
      throw new Error("Combined analysis couldn't detect valid results");
    }
    
    // Traduire les résultats en français
    const frenchColor = mapToFrenchColor(combinedResult.color);
    const frenchCategory = mapToFrenchCategory(combinedResult.category);
    
    // Validation finale des résultats
    const isBottom = isBottomGarment("", combinedResult.category);
    const validatedColor = validateDetectedColor(frenchColor, isBottom);
    
    console.log("Final results from combined analysis:");
    console.log("- Color:", validatedColor);
    console.log("- Category:", frenchCategory);
    
    return {
      color: validatedColor,
      category: frenchCategory || "T-shirt"
    };
  }
}

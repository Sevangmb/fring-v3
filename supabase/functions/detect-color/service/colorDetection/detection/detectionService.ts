
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2';
import { CombinedAnalysisStrategy } from './combinedAnalysisStrategy.ts';
import { TraditionalAnalysisStrategy } from './traditionalAnalysisStrategy.ts';
import { FallbackStrategy } from './fallbackStrategy.ts';

/**
 * Service central qui orchestre la détection des informations de vêtements
 */
export class DetectionService {
  /**
   * Analyse l'image du vêtement et détecte sa couleur et sa catégorie
   * @param imageUrl URL de l'image à analyser
   * @param hf Client Hugging Face Inference
   * @returns Informations détectées (couleur et catégorie)
   */
  async detectClothingInfo(imageUrl: string, hf: HfInference): Promise<{color: string, category: string}> {
    console.log("Starting detection service for image:", imageUrl.substring(0, 50) + "...");
    
    try {
      // Stratégie 1: Tenter l'analyse combinée (la plus rapide et généralement la plus précise)
      try {
        console.log("Attempting combined analysis strategy...");
        const combinedStrategy = new CombinedAnalysisStrategy();
        return await combinedStrategy.detect(imageUrl, hf);
      } catch (combinedError) {
        console.warn("Combined analysis strategy failed:", combinedError);
        
        // Stratégie 2: Tenter l'analyse traditionnelle
        try {
          console.log("Attempting traditional analysis strategy...");
          const traditionalStrategy = new TraditionalAnalysisStrategy();
          return await traditionalStrategy.detect(imageUrl, hf);
        } catch (traditionalError) {
          console.warn("Traditional analysis strategy failed:", traditionalError);
          
          // Stratégie 3: Utiliser la stratégie de secours (valeurs aléatoires)
          console.log("Falling back to random generation strategy...");
          const fallbackStrategy = new FallbackStrategy();
          return await fallbackStrategy.detect();
        }
      }
    } catch (error) {
      console.error("All detection strategies failed:", error);
      
      // Dernière ressource: toujours fournir une réponse même en cas d'erreur
      const fallbackStrategy = new FallbackStrategy();
      return await fallbackStrategy.detect();
    }
  }
}

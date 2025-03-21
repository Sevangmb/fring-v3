
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
   * @returns Informations détectées (couleur, catégorie et température)
   */
  async detectClothingInfo(imageUrl: string, hf: HfInference): Promise<{
    color: string, 
    category: string,
    temperature?: string
  }> {
    console.log("Starting detection service for image:", imageUrl.substring(0, 50) + "...");
    
    try {
      // Stratégie 1: Tenter l'analyse combinée (la plus rapide et généralement la plus précise)
      try {
        console.log("Attempting combined analysis strategy...");
        const combinedStrategy = new CombinedAnalysisStrategy();
        const result = await combinedStrategy.detect(imageUrl, hf);
        
        // Déduire la température en fonction de la catégorie
        const temperature = this.determineTemperatureFromCategory(result.category);
        
        return {
          ...result,
          temperature
        };
      } catch (combinedError) {
        console.warn("Combined analysis strategy failed:", combinedError);
        
        // Stratégie 2: Tenter l'analyse traditionnelle
        try {
          console.log("Attempting traditional analysis strategy...");
          const traditionalStrategy = new TraditionalAnalysisStrategy();
          const result = await traditionalStrategy.detect(imageUrl, hf);
          
          // Déduire la température en fonction de la catégorie
          const temperature = this.determineTemperatureFromCategory(result.category);
          
          return {
            ...result,
            temperature
          };
        } catch (traditionalError) {
          console.warn("Traditional analysis strategy failed:", traditionalError);
          
          // Stratégie 3: Utiliser la stratégie de secours (valeurs aléatoires)
          console.log("Falling back to random generation strategy...");
          const fallbackStrategy = new FallbackStrategy();
          const result = await fallbackStrategy.detect();
          
          // Déduire la température en fonction de la catégorie
          const temperature = this.determineTemperatureFromCategory(result.category);
          
          return {
            ...result,
            temperature
          };
        }
      }
    } catch (error) {
      console.error("All detection strategies failed:", error);
      
      // Dernière ressource: toujours fournir une réponse même en cas d'erreur
      const fallbackStrategy = new FallbackStrategy();
      const result = await fallbackStrategy.detect();
      
      return {
        ...result,
        temperature: "tempere" // Valeur par défaut
      };
    }
  }
  
  /**
   * Détermine la température appropriée pour une catégorie de vêtement
   * @param category Catégorie du vêtement
   * @returns Température (froid, tempere, chaud)
   */
  private determineTemperatureFromCategory(category: string): string {
    const categoryLower = category.toLowerCase();
    
    // Vêtements pour temps froid
    const coldItems = [
      "pull", "pullover", "sweat", "sweatshirt", "hoodie", "manteau", "veste", "jacket", 
      "coat", "blouson", "doudoune", "parka", "anorak", "cardigan", "sweater", "écharpe", 
      "bonnet", "gants", "pull-over"
    ];
    
    // Vêtements pour temps chaud
    const hotItems = [
      "short", "shorts", "t-shirt", "tank", "débardeur", "debardeur", "maillot", 
      "crop top", "swimsuit", "maillot de bain", "bikini", "sandales", "claquettes", 
      "tongs", "bermuda"
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
}

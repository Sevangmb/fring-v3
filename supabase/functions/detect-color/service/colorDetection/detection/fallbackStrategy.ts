
import { DetectionStrategy } from './detectionStrategy.ts';

/**
 * Stratégie de secours - génère des valeurs aléatoires quand les autres stratégies échouent
 */
export class FallbackStrategy implements DetectionStrategy {
  async detect(): Promise<{color: string, category: string}> {
    console.log("Executing fallback strategy with random values...");
    
    // Générer des résultats aléatoires
    const randomColors = ["rouge", "bleu", "vert", "jaune", "noir", "blanc", "violet", "orange"];
    const randomCategories = ["T-shirt", "Pantalon", "Chemise", "Robe", "Jupe", "Veste"];
    
    const randomColor = randomColors[Math.floor(Math.random() * randomColors.length)];
    const randomCategory = randomCategories[Math.floor(Math.random() * randomCategories.length)];
    
    console.log("Generated random values - Color:", randomColor, "Category:", randomCategory);
    
    return {
      color: randomColor,
      category: randomCategory
    };
  }
}

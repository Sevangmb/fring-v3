
/**
 * Service de détection locale pour l'analyse des couleurs via Canvas
 */
import { simplifyColor } from './utils';
import { generateFallbackResults } from './fallbackGenerator';

/**
 * Type pour la fonction de callback des étapes
 */
type StepCallback = (step: string) => void;

/**
 * Mode de détection local pour simuler la détection lorsque la fonction Edge n'est pas disponible
 * @param imageUrl URL de l'image (non utilisée dans cette implémentation)
 * @param onStep Callback pour suivre les étapes de traitement
 * @returns Résultats simulés
 */
export const simulateLocalDetection = async (imageUrl: string, onStep?: StepCallback): Promise<{color: string, category: string}> => {
  onStep?.("Simulation locale de la détection...");
  console.log('Simulation locale de la détection...');
  
  // Simuler un délai pour rendre la simulation plus réaliste
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // En mode local, essayons d'utiliser l'analyse des couleurs dominantes via le Canvas
  try {
    onStep?.("Tentative d'analyse des couleurs dominantes via Canvas");
    
    if (typeof document !== 'undefined' && imageUrl) {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = imageUrl;
      });
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error("Impossible de créer le contexte Canvas");
      }
      
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      // Calculer les couleurs dominantes
      const colorCounts: {[key: string]: number} = {};
      
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i+1];
        const b = data[i+2];
        
        // Regrouper les couleurs similaires
        const simplifiedColor = simplifyColor(r, g, b);
        colorCounts[simplifiedColor] = (colorCounts[simplifiedColor] || 0) + 1;
      }
      
      // Trouver la couleur dominante
      let maxCount = 0;
      let dominantColor = '';
      
      for (const color in colorCounts) {
        if (colorCounts[color] > maxCount) {
          maxCount = colorCounts[color];
          dominantColor = color;
        }
      }
      
      onStep?.(`Couleur dominante détectée via Canvas: ${dominantColor}`);
      
      // Définir une catégorie basée sur des heuristiques simples (exemple)
      const randomCategories = ['T-shirt', 'Chemise', 'Pull', 'Veste'];
      const category = randomCategories[Math.floor(Math.random() * randomCategories.length)];
      
      return {
        color: dominantColor,
        category: category
      };
    }
  } catch (canvasError) {
    console.error("Erreur lors de l'analyse via Canvas:", canvasError);
    onStep?.(`Erreur lors de l'analyse via Canvas: ${canvasError instanceof Error ? canvasError.message : "Erreur inconnue"}`);
  }
  
  // Si l'analyse via Canvas échoue, utiliser la fonction de secours
  return generateFallbackResults(onStep);
};

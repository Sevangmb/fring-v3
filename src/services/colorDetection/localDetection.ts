
/**
 * Service de détection locale pour l'analyse des couleurs via Canvas
 */
import { simplifyColor } from './utils';

/**
 * Type pour la fonction de callback des étapes
 */
type StepCallback = (step: string) => void;

// Mapping des couleurs simplifiées vers les noms de couleurs en français
const colorMapping: Record<string, string> = {
  "rgb(0,0,0)": "noir",
  "rgb(255,255,255)": "blanc",
  "rgb(128,128,128)": "gris",
  "rgb(255,0,0)": "rouge",
  "rgb(0,255,0)": "vert",
  "rgb(0,0,255)": "bleu",
  "rgb(255,255,0)": "jaune",
  "rgb(255,165,0)": "orange",
  "rgb(128,0,128)": "violet",
  "rgb(255,192,203)": "rose",
  "rgb(139,69,19)": "marron",
  "rgb(245,245,220)": "beige"
};

/**
 * Fonction pour classer un vêtement selon les pixels détectés
 */
function classifyClothing(imageData: ImageData): string {
  // Analyse basique de la forme pour déterminer le type de vêtement
  // Cette implémentation est simplifiée et peut être améliorée
  
  const width = imageData.width;
  const height = imageData.height;
  const data = imageData.data;
  
  // Calculer la proportion hauteur/largeur
  const ratio = height / width;
  
  if (ratio > 1.5) {
    // Vêtement allongé (robe, pantalon)
    return ratio > 2.5 ? "Pantalon" : "Robe";
  } else if (ratio < 0.8) {
    // Vêtement large (jupe, short)
    return "Jupe";
  } else {
    // Vêtement proportionné (t-shirt, chemise)
    // Analyse de la partie supérieure pour détecter les manches
    // Cette logique est simplifiée
    const hasTopDetails = false; // À implémenter avec une analyse plus détaillée
    
    return hasTopDetails ? "Chemise" : "T-shirt";
  }
}

/**
 * Mode de détection local pour simuler la détection lorsque la fonction Edge n'est pas disponible
 * @param imageUrl URL de l'image
 * @param onStep Callback pour suivre les étapes de traitement
 * @returns Résultats de l'analyse
 */
export const simulateLocalDetection = async (imageUrl: string, onStep?: StepCallback): Promise<{color: string, category: string}> => {
  onStep?.("Simulation locale de la détection...");
  console.log('Simulation locale de la détection...');
  
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
      
      // Convertir le code RGB en nom de couleur
      const colorName = colorMapping[dominantColor] || "bleu"; // Couleur par défaut si non trouvée
      
      // Détecter la catégorie basée sur l'analyse d'image
      const category = classifyClothing(imageData);
      
      onStep?.(`Analyse locale complétée - Couleur: ${colorName}, Catégorie: ${category}`);
      
      return {
        color: colorName,
        category: category
      };
    } else {
      throw new Error("Impossible d'accéder au document ou URL d'image invalide");
    }
  } catch (canvasError) {
    console.error("Erreur lors de l'analyse via Canvas:", canvasError);
    onStep?.(`Erreur lors de l'analyse via Canvas: ${canvasError instanceof Error ? canvasError.message : "Erreur inconnue"}`);
    throw new Error("L'analyse locale a échoué");
  }
};

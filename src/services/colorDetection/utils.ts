
/**
 * Utilitaires pour le service de détection de couleur
 */

/**
 * Type pour la fonction de callback des étapes
 */
type StepCallback = (step: string) => void;

/**
 * Simplifie la couleur RGB en réduisant le nombre de valeurs possibles
 * @param r Valeur de rouge (0-255)
 * @param g Valeur de vert (0-255)
 * @param b Valeur de bleu (0-255)
 * @returns Couleur simplifiée au format RGB
 */
export function simplifyColor(r: number, g: number, b: number): string {
  // Simplification des couleurs en réduisant le nombre de valeurs possibles
  // Quantification simple en 3 niveaux (0, 128, 255)
  const simplifyValue = (value: number): number => {
    if (value < 85) return 0;
    if (value < 170) return 128;
    return 255;
  };
  
  const simplifiedR = simplifyValue(r);
  const simplifiedG = simplifyValue(g);
  const simplifiedB = simplifyValue(b);
  
  return `rgb(${simplifiedR},${simplifiedG},${simplifiedB})`;
}

/**
 * Prépare l'URL de l'image pour l'envoi à l'API de détection
 * @param imageUrl URL de l'image (peut être une URL ou une chaîne base64)
 * @param onStep Callback pour suivre les étapes de traitement
 * @returns URL préparée
 */
export function prepareImageUrl(imageUrl: string, onStep?: StepCallback): string {
  // Vérifier si l'URL est au format base64
  const isBase64 = imageUrl.startsWith('data:');
  
  console.log('Format de l\'image pour détection:', isBase64 ? 'base64' : 'URL');
  console.log('URL tronquée:', isBase64 ? imageUrl.substring(0, 50) + '...' : imageUrl);
  
  if (isBase64) {
    onStep?.("Préparation de l'image au format base64");
    // Pour les images en base64, on les envoie telles quelles
    return imageUrl;
  }
  
  // Pour les URLs normales, vérifier qu'elles sont bien formées
  try {
    const url = new URL(imageUrl);
    onStep?.("Validation de l'URL de l'image");
    return url.toString();
  } catch (error) {
    console.error('URL d\'image invalide:', error);
    onStep?.("URL d'image invalide");
    throw new Error("L'URL de l'image est invalide");
  }
}

/**
 * Valide et normalise les résultats de détection
 * @param results Résultats bruts de la détection
 * @param onStep Callback pour suivre les étapes de traitement
 * @returns Résultats validés et normalisés
 */
export function validateDetectionResults(
  results: {color: string | null, category: string | null}, 
  onStep?: StepCallback
): {color: string, category: string} {
  onStep?.("Normalisation des résultats de détection");
  
  // Liste des couleurs autorisées
  const validColors = [
    'bleu', 'rouge', 'vert', 'jaune', 'noir', 'blanc', 
    'gris', 'violet', 'rose', 'orange', 'marron', 'beige'
  ];
  
  // Liste des catégories autorisées
  const validCategories = [
    'T-shirt', 'Chemise', 'Pull', 'Veste', 'Pantalon', 
    'Jeans', 'Jupe', 'Robe', 'Short', 'Manteau'
  ];
  
  // Vérifier et normaliser la couleur
  let normalizedColor = 'bleu'; // Valeur par défaut
  
  if (results.color) {
    const lowerColor = results.color.toLowerCase().trim();
    
    // Chercher une correspondance exacte
    if (validColors.includes(lowerColor)) {
      normalizedColor = lowerColor;
    } else {
      // Chercher une correspondance partielle
      for (const validColor of validColors) {
        if (lowerColor.includes(validColor) || validColor.includes(lowerColor)) {
          normalizedColor = validColor;
          break;
        }
      }
    }
  }
  
  // Vérifier et normaliser la catégorie
  let normalizedCategory = 'T-shirt'; // Valeur par défaut
  
  if (results.category) {
    const upperCaseCategory = results.category.charAt(0).toUpperCase() + results.category.slice(1).toLowerCase().trim();
    
    // Chercher une correspondance exacte
    if (validCategories.includes(upperCaseCategory)) {
      normalizedCategory = upperCaseCategory;
    } else {
      // Chercher une correspondance partielle
      for (const validCategory of validCategories) {
        if (upperCaseCategory.includes(validCategory) || validCategory.toLowerCase().includes(upperCaseCategory.toLowerCase())) {
          normalizedCategory = validCategory;
          break;
        }
      }
    }
  }
  
  console.log('Couleur détectée:', normalizedColor);
  console.log('Catégorie détectée:', normalizedCategory);
  
  return {
    color: normalizedColor,
    category: normalizedCategory
  };
}

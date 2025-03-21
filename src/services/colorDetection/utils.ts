
/**
 * Utilitaires pour le service de détection de couleur
 */

/**
 * Prépare l'URL de l'image pour l'envoi à l'API de détection
 * @param imageUrl URL de l'image (peut être une URL ou une chaîne base64)
 * @param onStep Callback pour suivre les étapes de traitement
 * @returns URL préparée pour l'API
 */
export const prepareImageUrl = (imageUrl: string, onStep?: (step: string) => void): string => {
  // Vérifier si l'image est au format base64 ou URL
  const isBase64 = imageUrl.startsWith('data:');
  
  // Tronquer l'URL/base64 pour le log
  const truncatedUrl = isBase64 
    ? imageUrl.substring(0, imageUrl.indexOf(",") + 10) + "..." 
    : imageUrl.substring(0, 50) + "...";
  
  console.log('Format de l\'image pour détection:', isBase64 ? "base64" : "URL");
  console.log('URL tronquée:', truncatedUrl);
  
  onStep?.(`Préparation de l'image au format ${isBase64 ? "base64" : "URL"}`);
  
  return imageUrl;
};

/**
 * Fonction utilitaire pour simplifier une couleur RGB en nom de couleur
 */
export const simplifyColor = (r: number, g: number, b: number): string => {
  const colors = [
    { name: "rouge", rgb: [255, 0, 0] },
    { name: "vert", rgb: [0, 255, 0] },
    { name: "bleu", rgb: [0, 0, 255] },
    { name: "jaune", rgb: [255, 255, 0] },
    { name: "cyan", rgb: [0, 255, 255] },
    { name: "magenta", rgb: [255, 0, 255] },
    { name: "blanc", rgb: [255, 255, 255] },
    { name: "noir", rgb: [0, 0, 0] },
    { name: "gris", rgb: [128, 128, 128] },
    { name: "orange", rgb: [255, 165, 0] },
    { name: "violet", rgb: [128, 0, 128] },
    { name: "marron", rgb: [165, 42, 42] }
  ];
  
  // Trouver la couleur la plus proche
  let closestColor = "";
  let minDistance = Number.MAX_VALUE;
  
  for (const color of colors) {
    const distance = Math.sqrt(
      Math.pow(r - color.rgb[0], 2) +
      Math.pow(g - color.rgb[1], 2) +
      Math.pow(b - color.rgb[2], 2)
    );
    
    if (distance < minDistance) {
      minDistance = distance;
      closestColor = color.name;
    }
  }
  
  return closestColor;
};

/**
 * Valide et normalise les données de détection
 * @param data Données brutes de l'API
 * @param onStep Callback pour suivre les étapes de traitement
 * @returns Données validées et normalisées
 */
export const validateDetectionResults = (data: any, onStep?: (step: string) => void): {color: string, category: string} => {
  // Vérifier que les données retournées sont valides
  if (!data || !data.color || !data.category) {
    console.warn('Données de détection incomplètes, utilisation de valeurs par défaut');
    onStep?.("Données de détection incomplètes, utilisation de valeurs par défaut");
    
    return {
      color: 'bleu',
      category: 'T-shirt'
    };
  }
  
  // Normaliser les résultats si nécessaire (première lettre en majuscule pour la catégorie)
  onStep?.("Normalisation des résultats de détection");
  return {
    color: data.color.toLowerCase(),
    category: data.category.charAt(0).toUpperCase() + data.category.slice(1)
  };
};

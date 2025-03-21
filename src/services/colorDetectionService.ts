
import { supabase } from '@/lib/supabase';

/**
 * Prépare l'URL de l'image pour l'envoi à l'API de détection
 * @param imageUrl URL de l'image (peut être une URL ou une chaîne base64)
 * @returns URL préparée pour l'API
 */
const prepareImageUrl = (imageUrl: string): string => {
  // Vérifier si l'image est au format base64 ou URL
  const isBase64 = imageUrl.startsWith('data:');
  
  // Tronquer l'URL/base64 pour le log
  const truncatedUrl = isBase64 
    ? imageUrl.substring(0, imageUrl.indexOf(",") + 10) + "..." 
    : imageUrl.substring(0, 50) + "...";
  
  console.log('Format de l\'image pour détection:', isBase64 ? "base64" : "URL");
  console.log('URL tronquée:', truncatedUrl);
  
  return imageUrl;
};

/**
 * Invoque la fonction Edge pour la détection des informations sur l'image
 * @param imageUrl URL de l'image à analyser
 * @returns Résultat brut de l'API
 */
const invokeDetectionFunction = async (imageUrl: string): Promise<any> => {
  console.log('Appel de la fonction Edge de détection...');
  
  const { data, error } = await supabase.functions.invoke('detect-color', {
    body: { imageUrl },
  });

  if (error) {
    console.error('Erreur lors de l\'appel à la fonction Edge:', error);
    throw new Error(`Erreur lors de la détection: ${error.message}`);
  }

  console.log('Résultat brut de la fonction Edge:', data);
  return data;
};

/**
 * Valide et normalise les données de détection
 * @param data Données brutes de l'API
 * @returns Données validées et normalisées
 */
const validateDetectionResults = (data: any): {color: string, category: string} => {
  // Vérifier que les données retournées sont valides
  if (!data || !data.color || !data.category) {
    console.warn('Données de détection incomplètes, utilisation de valeurs par défaut');
    
    return {
      color: 'bleu',
      category: 'T-shirt'
    };
  }
  
  // Normaliser les résultats si nécessaire (première lettre en majuscule pour la catégorie)
  return {
    color: data.color.toLowerCase(),
    category: data.category.charAt(0).toUpperCase() + data.category.slice(1)
  };
};

/**
 * Fonction principale pour détecter la couleur et la catégorie dominante d'une image de vêtement
 * @param imageUrl URL de l'image à analyser
 * @returns Les informations détectées (couleur et catégorie)
 */
export const detectImageInfo = async (imageUrl: string): Promise<{color: string, category: string}> => {
  try {
    // Étape 1: Afficher un message indiquant que la détection est en cours
    console.log('Détection des informations du vêtement en cours...');
    
    // Étape 2: Préparer l'URL de l'image
    const preparedImageUrl = prepareImageUrl(imageUrl);
    
    // Étape 3: Appeler la fonction Edge qui effectue la détection
    const rawDetectionData = await invokeDetectionFunction(preparedImageUrl);
    
    // Étape 4: Valider et normaliser les résultats
    const detectionResults = validateDetectionResults(rawDetectionData);
    
    // Étape 5: Afficher les informations détectées dans la console pour déboguer
    console.log('Couleur détectée:', detectionResults.color);
    console.log('Catégorie détectée:', detectionResults.category);
    
    return detectionResults;
  } catch (error) {
    console.error('Erreur lors de la détection:', error);
    throw error; // Propager l'erreur pour permettre une gestion appropriée en amont
  }
};

/**
 * Service de détection de la couleur et de la catégorie des vêtements
 */
export const ColorDetectionService = {
  detectImageInfo
};

// Exporter le service par défaut
export default ColorDetectionService;

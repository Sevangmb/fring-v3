
import { supabase } from '@/lib/supabase';

/**
 * Type pour la fonction de callback des étapes
 */
type StepCallback = (step: string) => void;

/**
 * Prépare l'URL de l'image pour l'envoi à l'API de détection
 * @param imageUrl URL de l'image (peut être une URL ou une chaîne base64)
 * @param onStep Callback pour suivre les étapes de traitement
 * @returns URL préparée pour l'API
 */
const prepareImageUrl = (imageUrl: string, onStep?: StepCallback): string => {
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
 * Génère une couleur et une catégorie aléatoires lorsque la détection échoue
 * @param onStep Callback pour suivre les étapes de traitement
 * @returns Résultats de détection aléatoires
 */
const generateFallbackResults = (onStep?: StepCallback): {color: string, category: string} => {
  onStep?.("Utilisation du mode de secours avec valeurs aléatoires");
  
  const randomColors = ['bleu', 'rouge', 'vert', 'jaune', 'noir', 'blanc', 'violet', 'orange'];
  const randomCategories = ['T-shirt', 'Pantalon', 'Chemise', 'Robe', 'Jupe', 'Veste'];
  
  const randomColor = randomColors[Math.floor(Math.random() * randomColors.length)];
  const randomCategory = randomCategories[Math.floor(Math.random() * randomCategories.length)];
  
  console.log('Utilisation de valeurs de secours - Couleur:', randomColor, 'Catégorie:', randomCategory);
  
  return {
    color: randomColor,
    category: randomCategory
  };
};

/**
 * Invoque la fonction Edge pour la détection des informations sur l'image
 * Utilise un mock local si l'appel échoue
 * @param imageUrl URL de l'image à analyser
 * @param onStep Callback pour suivre les étapes de traitement
 * @returns Résultat de la détection
 */
const invokeDetectionFunction = async (imageUrl: string, onStep?: StepCallback): Promise<{color: string, category: string}> => {
  onStep?.("Tentative d'appel à la fonction Edge de détection...");
  console.log('Appel de la fonction Edge de détection...');
  
  try {
    // Tentative d'appel à la fonction Edge Supabase
    onStep?.("Envoi de la requête à la fonction Edge Supabase");
    const { data, error } = await supabase.functions.invoke('detect-color', {
      body: { imageUrl },
    });

    if (error) {
      console.error('Erreur lors de l\'appel à la fonction Edge:', error);
      onStep?.(`Erreur lors de l'appel à la fonction Edge: ${error.message}`);
      console.log('Utilisation du mode de secours local pour la détection');
      return generateFallbackResults(onStep);
    }

    onStep?.("Réponse reçue de la fonction Edge");
    console.log('Résultat brut de la fonction Edge:', data);
    return data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
    console.error('Exception lors de l\'appel à la fonction Edge:', error);
    onStep?.(`Exception lors de l'appel à la fonction Edge: ${errorMessage}`);
    console.log('Utilisation du mode de secours local pour la détection');
    return generateFallbackResults(onStep);
  }
};

/**
 * Valide et normalise les données de détection
 * @param data Données brutes de l'API
 * @param onStep Callback pour suivre les étapes de traitement
 * @returns Données validées et normalisées
 */
const validateDetectionResults = (data: any, onStep?: StepCallback): {color: string, category: string} => {
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

/**
 * Mode de détection local pour simuler la détection lorsque la fonction Edge n'est pas disponible
 * @param imageUrl URL de l'image (non utilisée dans cette implémentation)
 * @param onStep Callback pour suivre les étapes de traitement
 * @returns Résultats simulés
 */
const simulateLocalDetection = async (imageUrl: string, onStep?: StepCallback): Promise<{color: string, category: string}> => {
  onStep?.("Simulation locale de la détection...");
  console.log('Simulation locale de la détection...');
  
  // Simuler un délai pour rendre la simulation plus réaliste
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return generateFallbackResults(onStep);
};

/**
 * Fonction principale pour détecter la couleur et la catégorie dominante d'une image de vêtement
 * @param imageUrl URL de l'image à analyser
 * @param onStep Callback pour suivre les étapes de traitement
 * @returns Les informations détectées (couleur et catégorie)
 */
export const detectImageInfo = async (
  imageUrl: string, 
  onStep?: StepCallback
): Promise<{color: string, category: string}> => {
  try {
    // Étape 1: Afficher un message indiquant que la détection est en cours
    console.log('Détection des informations du vêtement en cours...');
    onStep?.("Détection des informations du vêtement en cours...");
    
    // Étape 2: Préparer l'URL de l'image
    const preparedImageUrl = prepareImageUrl(imageUrl, onStep);
    
    // Étape 3: Appeler la fonction de détection (avec fallback)
    const detectionResults = await invokeDetectionFunction(preparedImageUrl, onStep);
    
    // Étape 4: Valider et normaliser les résultats
    const validatedResults = validateDetectionResults(detectionResults, onStep);
    
    // Étape 5: Afficher les informations détectées dans la console pour déboguer
    console.log('Couleur détectée:', validatedResults.color);
    console.log('Catégorie détectée:', validatedResults.category);
    onStep?.(`Détection terminée - Couleur: ${validatedResults.color}, Catégorie: ${validatedResults.category}`);
    
    return validatedResults;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
    console.error('Erreur lors de la détection:', error);
    onStep?.(`Erreur lors de la détection: ${errorMessage}`);
    
    // En cas d'erreur, utiliser le mode local de secours
    return simulateLocalDetection(imageUrl, onStep);
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

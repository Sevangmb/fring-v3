
/**
 * Service principal de détection de couleur pour les vêtements
 */
import { prepareImageUrl, validateDetectionResults } from './utils';
import { invokeDetectionFunction } from './edgeDetection';
import { simulateLocalDetection } from './localDetection';

/**
 * Type pour la fonction de callback des étapes
 */
type StepCallback = (step: string) => void;

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

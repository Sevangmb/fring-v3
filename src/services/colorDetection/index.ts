
/**
 * Service principal de détection de couleur pour les vêtements
 */
import { prepareImageUrl } from './utils';
import { invokeDetectionFunction } from './edgeDetection';

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
    
    // Étape 3: Appeler la fonction de détection Edge
    onStep?.("Appel du service de détection - cela peut prendre jusqu'à 20 secondes...");
    const detectionResults = await invokeDetectionFunction(preparedImageUrl, onStep);
    
    // Vérifier si la détection a réussi
    if (!detectionResults.color || !detectionResults.category) {
      onStep?.("La détection a échoué. Veuillez réessayer ou saisir les valeurs manuellement.");
      throw new Error("Impossible de détecter la couleur et la catégorie");
    }
    
    // Étape 4: Afficher les informations détectées dans la console pour déboguer
    console.log('Couleur détectée:', detectionResults.color);
    console.log('Catégorie détectée:', detectionResults.category);
    onStep?.(`Détection terminée - Couleur: ${detectionResults.color}, Catégorie: ${detectionResults.category}`);
    
    return {
      color: detectionResults.color,
      category: detectionResults.category
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
    console.error('Erreur lors de la détection:', error);
    onStep?.(`Erreur lors de la détection: ${errorMessage}`);
    
    // Ne pas retourner de valeurs aléatoires mais plutôt une erreur
    throw new Error("Impossible de détecter la couleur et la catégorie");
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

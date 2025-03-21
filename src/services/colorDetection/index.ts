
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
    
    // Étape 3: Appeler la fonction de détection Edge
    const detectionResults = await invokeDetectionFunction(preparedImageUrl, onStep);
    
    // Vérifier si la détection a réussi
    if (!detectionResults.color || !detectionResults.category) {
      onStep?.("La détection à distance a échoué, tentative avec la méthode locale...");
      
      // Essayer la méthode locale si l'Edge Function échoue
      const localResults = await simulateLocalDetection(preparedImageUrl, onStep);
      
      // Vérifier si la détection locale a réussi
      if (!localResults.color || !localResults.category) {
        onStep?.("Échec de la détection. Veuillez réessayer ou saisir les valeurs manuellement.");
        throw new Error("Impossible de détecter la couleur et la catégorie");
      }
      
      // Retourner les résultats de la détection locale
      onStep?.(`Détection locale réussie - Couleur: ${localResults.color}, Catégorie: ${localResults.category}`);
      return localResults;
    }
    
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
    
    // Ne pas retourner de valeurs aléatoires mais plutôt une erreur
    onStep?.("Échec de la détection. Veuillez réessayer ou saisir les valeurs manuellement.");
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

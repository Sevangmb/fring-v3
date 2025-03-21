
/**
 * Service pour l'utilisation de la fonction Edge de détection de couleur
 */
import { supabase } from '@/lib/supabase';
import { generateFallbackResults } from './fallbackGenerator';

/**
 * Type pour la fonction de callback des étapes
 */
type StepCallback = (step: string) => void;

/**
 * Invoque la fonction Edge pour la détection des informations sur l'image
 * Utilise un mock local si l'appel échoue
 * @param imageUrl URL de l'image à analyser
 * @param onStep Callback pour suivre les étapes de traitement
 * @returns Résultat de la détection
 */
export const invokeDetectionFunction = async (imageUrl: string, onStep?: StepCallback): Promise<{color: string, category: string}> => {
  onStep?.("Tentative d'appel à la fonction Edge de détection...");
  console.log('Appel de la fonction Edge de détection...');
  
  try {
    // Vérification de la connexion à Supabase
    onStep?.("Vérification de la connexion à Supabase...");
    const { data: testData, error: testError } = await supabase.auth.getSession();
    
    if (testError) {
      onStep?.(`Erreur de connexion à Supabase: ${testError.message}`);
      throw new Error(`Erreur de connexion: ${testError.message}`);
    }

    onStep?.("Connexion à Supabase OK. Préparation de la requête...");
    
    // Tentative d'appel à la fonction Edge Supabase
    onStep?.("Envoi de la requête à la fonction Edge Supabase 'detect-color'");
    
    // On divise l'opération en 2 parties pour mieux détecter où se situe l'erreur
    let functionInvocationStarted = false;
    
    try {
      functionInvocationStarted = true;
      
      const { data, error } = await supabase.functions.invoke('detect-color', {
        body: { imageUrl },
      });

      if (error) {
        onStep?.(`Erreur lors de l'appel à la fonction Edge: ${error.message}`);
        console.error('Erreur lors de l\'appel à la fonction Edge:', error);
        return generateFallbackResults(onStep);
      }

      onStep?.("Réponse reçue de la fonction Edge");
      console.log('Résultat brut de la fonction Edge:', data);
      
      // Vérifier si la réponse contient une erreur interne
      if (data && data.error) {
        onStep?.(`Erreur interne dans la fonction Edge: ${data.error}`);
        console.warn('La fonction Edge a retourné une erreur:', data.error);
        
        // Si malgré l'erreur, la fonction a retourné des valeurs, les utiliser
        if (data.color && data.category) {
          onStep?.(`Utilisation des valeurs de secours fournies par la fonction: ${data.color}, ${data.category}`);
          return {
            color: data.color,
            category: data.category
          };
        }
        
        // Sinon, utiliser les valeurs de secours
        return generateFallbackResults(onStep);
      }
      
      return data;
    } catch (functionError) {
      const errorMessage = functionError instanceof Error ? functionError.message : "Erreur inconnue";
      
      if (functionInvocationStarted) {
        onStep?.(`Erreur pendant l'exécution de la fonction Edge: ${errorMessage}`);
      } else {
        onStep?.(`Erreur avant l'appel de la fonction Edge: ${errorMessage}`);
      }
      
      console.error('Exception lors de l\'appel à la fonction Edge:', functionError);
      return generateFallbackResults(onStep);
    }
  } catch (connectionError) {
    const errorMessage = connectionError instanceof Error ? connectionError.message : "Erreur inconnue";
    onStep?.(`Erreur de connexion à Supabase: ${errorMessage}`);
    console.error('Erreur de connexion:', connectionError);
    return generateFallbackResults(onStep);
  }
};

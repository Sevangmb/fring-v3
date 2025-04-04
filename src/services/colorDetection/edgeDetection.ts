
/**
 * Service pour l'utilisation de la fonction Edge de détection de couleur
 */
import { supabase } from '@/lib/supabase';

/**
 * Type pour la fonction de callback des étapes
 */
type StepCallback = (step: string) => void;

/**
 * Invoque la fonction Edge pour la détection des informations sur l'image
 * @param imageUrl URL de l'image à analyser
 * @param onStep Callback pour suivre les étapes de traitement
 * @returns Résultat de la détection
 */
export const invokeDetectionFunction = async (imageUrl: string, onStep?: StepCallback): Promise<{
  color: string | null, 
  category: string | null,
  description?: string | null,
  brand?: string | null,
  temperature?: string | null,
  weatherType?: string | null
}> => {
  onStep?.("Tentative d'appel à la fonction Edge de détection avec Google AI Gemini...");
  console.log('Appel de la fonction Edge de détection avec Google AI Gemini...');
  
  try {
    // Vérification de la connexion à Supabase
    onStep?.("Vérification de la connexion à Supabase...");
    
    // Tentative d'appel à la fonction Edge Supabase
    onStep?.("Envoi de la requête à la fonction Edge Supabase 'detect-color'");
    
    // Timeout pour l'appel à la fonction (30 secondes maximum, car Gemini peut prendre un peu plus de temps)
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("Délai d'attente de la fonction dépassé")), 30000)
    );
    
    // Appel effectif à la fonction Edge
    const responsePromise = supabase.functions.invoke('detect-color', {
      body: { imageUrl },
    });
    
    // Utiliser race pour implémenter un timeout
    // @ts-ignore - Le type exact de Promise.race n'est pas important ici
    const { data, error } = await Promise.race([responsePromise, timeoutPromise]);

    if (error) {
      onStep?.(`Erreur lors de l'appel à la fonction Edge: ${error.message}`);
      console.error('Erreur lors de l\'appel à la fonction Edge:', error);
      return { color: null, category: null, description: null, brand: null };
    }

    onStep?.("Réponse reçue de la fonction Edge avec Google AI Gemini");
    console.log('Résultat brut de la fonction Edge:', data);
    
    // Vérifier si la réponse contient une erreur interne
    if (data && data.error) {
      onStep?.(`Erreur interne dans la fonction Edge: ${data.error}`);
      console.warn('La fonction Edge a retourné une erreur:', data.error);
      return { color: null, category: null, description: null, brand: null };
    }
    
    if (!data || !data.color || !data.category) {
      onStep?.("La fonction a retourné des données incomplètes");
      console.warn('Données incomplètes:', data);
      return { color: null, category: null, description: null, brand: null };
    }
    
    return {
      color: data.color,
      category: data.category,
      description: data.description || null,
      brand: data.brand || null,
      temperature: data.temperature || null,
      weatherType: data.weatherType || null
    };
  } catch (connectionError) {
    const errorMessage = connectionError instanceof Error ? connectionError.message : "Erreur inconnue";
    onStep?.(`Erreur de connexion: ${errorMessage}`);
    console.error('Erreur de connexion:', connectionError);
    return { color: null, category: null, description: null, brand: null };
  }
};

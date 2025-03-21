
import { supabase } from '@/lib/supabase';

/**
 * Type pour la fonction de callback des étapes
 */
type StepCallback = (step: string) => void;

/**
 * Type pour les résultats de détection
 */
export interface DetectionResult {
  color: string;
  category: string;
  description?: string;
  brand?: string;
  temperature?: "froid" | "tempere" | "chaud";
  weatherType?: "pluie" | "neige" | "normal";
}

/**
 * Service principal pour la détection d'images de vêtements
 */
export class DetectionService {
  /**
   * Détecte la couleur et la catégorie d'un vêtement depuis une image
   * @param imageUrl URL ou chaîne base64 de l'image
   * @param onStep Callback pour suivre les étapes de détection
   * @returns Résultat de la détection
   */
  static async detectClothingInfo(
    imageUrl: string,
    onStep?: StepCallback
  ): Promise<DetectionResult> {
    try {
      // Étape 1: Préparation de l'analyse
      onStep?.("Préparation de l'image pour l'analyse avec Google AI Gemini");
      console.log("Détection des informations du vêtement en cours...");
      
      // Étape 2: Vérification du format de l'image
      const isBase64 = imageUrl.startsWith('data:');
      console.log(`Format de l'image pour détection: ${isBase64 ? 'base64' : 'URL'}`);
      
      // Étape 3: Appel à la fonction Edge
      onStep?.("Appel du service de détection - cela peut prendre jusqu'à 20 secondes...");
      
      // Timeout pour l'appel à la fonction (30 secondes maximum)
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Délai d'attente de la fonction dépassé")), 30000)
      );
      
      // Appel à la fonction Edge
      const responsePromise = supabase.functions.invoke('detect-color', {
        body: { imageUrl },
      });
      
      // Utiliser race pour implémenter un timeout
      // @ts-ignore - Le type exact de Promise.race n'est pas important ici
      const { data, error } = await Promise.race([responsePromise, timeoutPromise]);
      
      if (error) {
        onStep?.(`Erreur lors de l'appel à la fonction Edge: ${error.message}`);
        console.error('Erreur lors de l\'appel à la fonction Edge:', error);
        throw new Error(`Erreur lors de l'appel à la fonction de détection: ${error.message}`);
      }
      
      onStep?.("Réponse reçue de la fonction Edge avec Google AI Gemini");
      console.log('Résultat brut de la fonction Edge:', data);
      
      // Vérifier si la réponse contient une erreur interne
      if (data && data.error) {
        onStep?.(`Erreur interne dans la fonction Edge: ${data.error}`);
        console.warn('La fonction Edge a retourné une erreur:', data.error);
        throw new Error(data.error);
      }
      
      // Vérifier si les données sont valides
      if (!data || !data.color || !data.category) {
        onStep?.("La fonction a retourné des données incomplètes");
        console.warn('Données incomplètes:', data);
        throw new Error("Données de détection incomplètes");
      }
      
      // Normaliser les résultats
      const result: DetectionResult = {
        color: data.color.toLowerCase().trim(),
        category: data.category,
        description: data.description || undefined,
        brand: data.brand || undefined,
        temperature: data.temperature || undefined,
        weatherType: data.weatherType || undefined
      };
      
      onStep?.(`Détection terminée - Couleur: ${result.color}, Catégorie: ${result.category}`);
      
      // Journaliser les résultats
      console.log('Couleur détectée:', result.color);
      console.log('Catégorie détectée:', result.category);
      console.log('Description détectée:', result.description || 'Non disponible');
      console.log('Marque détectée:', result.brand || 'Non disponible');
      console.log('Température détectée:', result.temperature || 'Non disponible');
      console.log('Type de météo détecté:', result.weatherType || 'Non disponible');
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
      console.error('Erreur lors de la détection:', error);
      throw new Error(`La détection a échoué: ${errorMessage}`);
    }
  }
}

export default DetectionService;

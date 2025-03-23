
/**
 * Utilitaire pour réessayer les requêtes API échouées avec backoff exponentiel
 */
export const fetchWithRetry = async (
  fetchFn: () => Promise<any>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<any> => {
  let lastError;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      // Vérifier d'abord la connectivité Internet
      if (!navigator.onLine) {
        throw new Error('Pas de connexion Internet');
      }
      
      return await fetchFn();
    } catch (error) {
      console.log(`Tentative ${attempt + 1}/${maxRetries} échouée:`, error);
      lastError = error;
      
      if (attempt < maxRetries - 1) {
        // Attendre avant de réessayer avec un backoff exponentiel
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt)));
      }
    }
  }
  
  throw lastError;
};

/**
 * Fonction utilitaire pour vérifier si l'application est connectée à Internet
 * et peut atteindre le backend Supabase
 */
export const checkConnection = async (): Promise<boolean> => {
  if (!navigator.onLine) {
    return false;
  }
  
  try {
    // Vérifier si nous pouvons nous connecter à notre backend
    const response = await fetch('/api/health-check', { 
      method: 'HEAD',
      // Utiliser un court timeout pour déterminer rapidement la connectivité
      signal: AbortSignal.timeout(2000)
    });
    return response.ok;
  } catch (error) {
    console.error("Erreur lors de la vérification de la connexion:", error);
    return navigator.onLine; // Fallback sur l'état de connexion du navigateur
  }
};

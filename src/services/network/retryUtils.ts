
/**
 * Fonction pour réessayer une requête API en cas d'échec
 * 
 * @param fetchFunction Fonction qui effectue la requête API
 * @param maxRetries Nombre maximum de tentatives
 * @param retryDelay Délai entre chaque tentative en ms
 * @returns Résultat de la requête API
 */
export const fetchWithRetry = async <T>(
  fetchFunction: () => Promise<T>,
  maxRetries: number = 3,
  retryDelay: number = 1000
): Promise<T> => {
  let lastError: any;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await fetchFunction();
      return result;
    } catch (error) {
      console.error(`Tentative ${attempt}/${maxRetries} échouée:`, error);
      lastError = error;
      
      // Si ce n'est pas la dernière tentative, attendre avant de réessayer
      if (attempt < maxRetries) {
        // Délai exponentiel avec un peu de hasard pour éviter les collisions
        const jitter = Math.random() * 0.3 + 0.85; // entre 0.85 et 1.15
        const delay = retryDelay * Math.pow(1.5, attempt - 1) * jitter;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  // Si toutes les tentatives ont échoué, propager la dernière erreur
  throw lastError;
};

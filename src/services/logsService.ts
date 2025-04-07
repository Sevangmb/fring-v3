
// Re-export all log-related functions from the logs module
export * from './logs';

// Initialize the logs system
export const initializeLogsSystem = async () => {
  try {
    // Import the function from the correct module
    const { initializeLogsSystem: initialize } = await import('./logs');
    
    const success = await initialize();
    if (success) {
      console.log("Système de logs initialisé avec succès.");
    } else {
      console.log("La table de logs n'existe pas, elle sera créée automatiquement lors de la première écriture.");
    }
    return success;
  } catch (error) {
    console.error("Erreur lors de l'initialisation du système de logs:", error);
    return false;
  }
};

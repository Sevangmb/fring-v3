
// Re-export all log-related functions from the logs module
export * from './logs';

// Initialize logs table if needed
import { checkLogsTableExists } from './logs';

// Initialize the logs system
export const initializeLogsSystem = async () => {
  try {
    const exists = await checkLogsTableExists();
    if (!exists) {
      console.log("La table de logs n'existe pas, elle sera créée automatiquement lors de la première écriture.");
    } else {
      console.log("Système de logs initialisé avec succès.");
    }
    return true;
  } catch (error) {
    console.error("Erreur lors de l'initialisation du système de logs:", error);
    return false;
  }
};

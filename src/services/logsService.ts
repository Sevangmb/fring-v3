
/**
 * Service pour la gestion des logs système
 */

// Types
export interface LogEntry {
  id: string;
  level: 'info' | 'error' | 'warning' | 'debug';
  message: string;
  timestamp: number;
  details?: any;
  source?: string;
  path?: string;
  status?: string;
  error?: Error;
}

// Clé de stockage dans localStorage
const LOGS_STORAGE_KEY = 'fring_app_logs';

// Maximum de logs à conserver
const MAX_LOGS = 1000;

/**
 * Récupère tous les logs stockés
 */
export const getLogs = (): LogEntry[] => {
  try {
    const storedLogs = localStorage.getItem(LOGS_STORAGE_KEY);
    if (storedLogs) {
      return JSON.parse(storedLogs) as LogEntry[];
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des logs', error);
  }
  return [];
};

/**
 * Enregistre un nouveau log
 */
export const logEvent = (
  level: 'info' | 'error' | 'warning' | 'debug',
  message: string,
  details?: any
): LogEntry => {
  // Capturer la trace d'appel
  const stackTrace = new Error().stack || '';
  const stackLines = stackTrace.split('\n');
  const callerLine = stackLines.length > 2 ? stackLines[2] : 'unknown';
  
  const newLog: LogEntry = {
    id: crypto.randomUUID(),
    level,
    message,
    timestamp: Date.now(),
    details,
    source: callerLine.trim()
  };

  // Récupérer les logs existants
  const existingLogs = getLogs();
  
  // Ajouter le nouveau log au début
  const updatedLogs = [newLog, ...existingLogs].slice(0, MAX_LOGS);
  
  // Sauvegarder dans localStorage
  try {
    localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(updatedLogs));
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des logs', error);
  }
  
  return newLog;
};

/**
 * Efface tous les logs
 */
export const clearLogs = (): void => {
  try {
    localStorage.removeItem(LOGS_STORAGE_KEY);
  } catch (error) {
    console.error('Erreur lors de la suppression des logs', error);
  }
};

/**
 * Configure l'interception des logs console
 */
export const setupLogInterceptors = (): () => void => {
  // Sauvegarder les fonctions originales
  const originalConsoleLog = console.log;
  const originalConsoleInfo = console.info;
  const originalConsoleWarn = console.warn;
  const originalConsoleError = console.error;

  // Intercepter console.log
  console.log = function(...args) {
    logEvent('debug', args.join(' '));
    originalConsoleLog.apply(console, args);
  };

  // Intercepter console.info
  console.info = function(...args) {
    logEvent('info', args.join(' '));
    originalConsoleInfo.apply(console, args);
  };

  // Intercepter console.warn
  console.warn = function(...args) {
    logEvent('warning', args.join(' '));
    originalConsoleWarn.apply(console, args);
  };

  // Intercepter console.error
  console.error = function(...args) {
    // Détecter si le premier argument est une erreur
    const firstArg = args[0];
    const errorDetails = firstArg instanceof Error 
      ? { message: firstArg.message, stack: firstArg.stack }
      : undefined;
      
    logEvent('error', args.join(' '), errorDetails);
    originalConsoleError.apply(console, args);
  };

  // Fonction pour restaurer les fonctions originales
  return () => {
    console.log = originalConsoleLog;
    console.info = originalConsoleInfo;
    console.warn = originalConsoleWarn;
    console.error = originalConsoleError;
  };
};

/**
 * Intercepte les erreurs globales et les promesses non gérées
 */
export const setupGlobalErrorHandlers = (): () => void => {
  // Gestionnaire d'erreurs globales
  const handleGlobalError = (event: ErrorEvent) => {
    logEvent('error', `Erreur non capturée: ${event.message}`, {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      stack: event.error?.stack
    });
  };

  // Gestionnaire de promesses rejetées non gérées
  const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    logEvent('error', `Promesse rejetée non gérée`, {
      reason: event.reason
    });
  };

  // Ajouter les écouteurs
  window.addEventListener('error', handleGlobalError);
  window.addEventListener('unhandledrejection', handleUnhandledRejection);

  // Retourner une fonction pour nettoyer
  return () => {
    window.removeEventListener('error', handleGlobalError);
    window.removeEventListener('unhandledrejection', handleUnhandledRejection);
  };
};

/**
 * Configure un intercepteur pour les requêtes réseau
 */
export const setupNetworkInterceptors = (): () => void => {
  // Sauvegarder la fonction fetch originale
  const originalFetch = window.fetch;

  // Remplacer par notre version instrumentée
  window.fetch = async function(input, init) {
    const startTime = performance.now();
    const url = typeof input === 'string' 
      ? input 
      : input instanceof URL 
        ? input.toString() 
        : input.url;
    
    logEvent('info', `Requête réseau démarrée: ${url}`);
    
    try {
      const response = await originalFetch.apply(this, [input, init]);
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      logEvent('info', `Requête réseau terminée: ${url} (${duration.toFixed(2)}ms) - Status: ${response.status}`, {
        duration,
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries([...response.headers.entries()]),
        path: url
      });
      
      return response;
    } catch (error) {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      logEvent('error', `Erreur de requête réseau: ${url} (${duration.toFixed(2)}ms)`, {
        duration,
        error: error,
        path: url
      });
      
      throw error;
    }
  };

  // Retourner une fonction pour restaurer la fonction originale
  return () => {
    window.fetch = originalFetch;
  };
};

/**
 * Configure tous les intercepteurs de logs
 */
export const setupAllLogInterceptors = (): () => void => {
  const cleanupConsole = setupLogInterceptors();
  const cleanupGlobalErrors = setupGlobalErrorHandlers();
  const cleanupNetwork = setupNetworkInterceptors();
  
  // Retourner une fonction qui nettoie tous les intercepteurs
  return () => {
    cleanupConsole();
    cleanupGlobalErrors();
    cleanupNetwork();
  };
};

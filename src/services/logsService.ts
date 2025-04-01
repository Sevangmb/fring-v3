
import { supabase } from '@/lib/supabase';

/**
 * Configuration des intercepteurs de logs pour différentes parties de l'application
 */

/**
 * Type pour définir les niveaux de logs
 */
export type LogLevel = 'info' | 'warning' | 'error' | 'debug';

/**
 * Interface pour un log
 */
export interface LogEntry {
  level: LogLevel;
  message: string;
  source: string;
  timestamp: string;
  data?: any;
  userId?: string;
}

/**
 * Enregistre un log dans la console et éventuellement dans Supabase
 */
export const logMessage = async (
  level: LogLevel,
  message: string,
  source: string,
  data?: any,
  userId?: string
) => {
  const timestamp = new Date().toISOString();
  const logEntry: LogEntry = {
    level,
    message,
    source,
    timestamp,
    data,
    userId
  };

  // Log dans la console avec le style approprié
  switch (level) {
    case 'info':
      console.info(`[${source}] ${message}`, data || '');
      break;
    case 'warning':
      console.warn(`[${source}] ${message}`, data || '');
      break;
    case 'error':
      console.error(`[${source}] ${message}`, data || '');
      break;
    case 'debug':
      console.debug(`[${source}] ${message}`, data || '');
      break;
  }

  // Stocker le log dans Supabase (à implémenter si nécessaire)
  try {
    /* Exemple de stockage dans Supabase (à décommenter si table existante)
    const { error } = await supabase
      .from('logs')
      .insert([logEntry]);

    if (error) {
      console.error('Erreur lors de l\'enregistrement du log dans Supabase:', error);
    }
    */
  } catch (error) {
    console.error('Erreur lors de la tentative d\'enregistrement du log:', error);
  }

  return logEntry;
};

/**
 * Intercepte les appels console.log et les redirige
 */
export const setupConsoleInterceptor = () => {
  const originalLog = console.log;
  const originalInfo = console.info;
  const originalWarn = console.warn;
  const originalError = console.error;
  const originalDebug = console.debug;

  // On ne modifie pas les fonctions de console dans un environnement de production
  if (process.env.NODE_ENV === 'production') {
    console.log = function(...args: any[]) {
      originalLog.apply(console, args);
      logMessage('info', args.join(' '), 'console');
    };

    console.info = function(...args: any[]) {
      originalInfo.apply(console, args);
      logMessage('info', args.join(' '), 'console');
    };

    console.warn = function(...args: any[]) {
      originalWarn.apply(console, args);
      logMessage('warning', args.join(' '), 'console');
    };

    console.error = function(...args: any[]) {
      originalError.apply(console, args);
      logMessage('error', args.join(' '), 'console');
    };

    console.debug = function(...args: any[]) {
      originalDebug.apply(console, args);
      logMessage('debug', args.join(' '), 'console');
    };
  }

  // Fonction de nettoyage pour restaurer les fonctions d'origine
  return () => {
    console.log = originalLog;
    console.info = originalInfo;
    console.warn = originalWarn;
    console.error = originalError;
    console.debug = originalDebug;
  };
};

/**
 * Configure l'interception des erreurs non capturées
 */
export const setupErrorInterceptor = () => {
  const originalOnError = window.onerror;

  window.onerror = function(message, source, lineno, colno, error) {
    logMessage('error', String(message), 'window', {
      source,
      lineno,
      colno,
      stack: error?.stack
    });

    if (originalOnError) {
      return originalOnError.apply(this, [message, source, lineno, colno, error]);
    }
    return false;
  };

  // Fonction de nettoyage
  return () => {
    window.onerror = originalOnError;
  };
};

/**
 * Configure l'interception des promesses rejetées non capturées
 */
export const setupPromiseInterceptor = () => {
  const originalOnUnhandledRejection = window.onunhandledrejection;

  window.onunhandledrejection = function(event) {
    logMessage('error', 'Promesse rejetée non capturée', 'promise', {
      reason: event.reason,
      stack: event.reason?.stack
    });

    if (originalOnUnhandledRejection) {
      return originalOnUnhandledRejection.apply(this, [event]);
    }
  };

  // Fonction de nettoyage
  return () => {
    window.onunhandledrejection = originalOnUnhandledRejection;
  };
};

/**
 * Configure tous les intercepteurs de logs
 */
export const setupAllLogInterceptors = () => {
  const cleanupConsole = setupConsoleInterceptor();
  const cleanupError = setupErrorInterceptor();
  const cleanupPromise = setupPromiseInterceptor();

  // Retourne une fonction qui nettoie tous les intercepteurs
  return () => {
    cleanupConsole();
    cleanupError();
    cleanupPromise();
  };
};

/**
 * Récupère les logs depuis Supabase
 * À implémenter quand la table de logs sera créée
 */
export const fetchLogs = async (limit = 100, offset = 0, filters: Partial<LogEntry> = {}) => {
  try {
    // Exemple à implémenter quand la table logs existe
    /* 
    let query = supabase
      .from('logs')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit)
      .range(offset, offset + limit - 1);

    // Appliquer les filtres
    if (filters.level) {
      query = query.eq('level', filters.level);
    }
    if (filters.source) {
      query = query.eq('source', filters.source);
    }
    if (filters.userId) {
      query = query.eq('userId', filters.userId);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return data;
    */

    // Pour l'instant, retourne un tableau vide
    return [];
  } catch (error) {
    console.error('Erreur lors de la récupération des logs:', error);
    throw error;
  }
};

/**
 * Efface tous les logs ou des logs spécifiques
 * À implémenter quand la table de logs sera créée
 */
export const clearLogs = async (filters: Partial<LogEntry> = {}) => {
  try {
    // Exemple à implémenter quand la table logs existe
    /*
    let query = supabase.from('logs').delete();

    // Appliquer les filtres pour ne supprimer que certains logs
    if (filters.level) {
      query = query.eq('level', filters.level);
    }
    if (filters.source) {
      query = query.eq('source', filters.source);
    }
    if (filters.userId) {
      query = query.eq('userId', filters.userId);
    }

    const { error } = await query;

    if (error) {
      throw error;
    }

    return true;
    */

    // Pour l'instant, retourne simplement true
    return true;
  } catch (error) {
    console.error('Erreur lors de la suppression des logs:', error);
    throw error;
  }
};

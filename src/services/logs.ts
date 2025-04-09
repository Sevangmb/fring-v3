
import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";

// Types for log entries
export interface LogEntry {
  id?: string;
  message: string;
  level: LogLevel;
  details?: string;
  category?: string;
  created_at?: string;
  user_id?: string;
}

export type LogLevel = 'info' | 'warning' | 'error' | 'debug';

/**
 * Écrit un message dans les logs
 * 
 * @param message - Message principal du log
 * @param level - Niveau du log (info, warning, error, debug)
 * @param details - Détails additionnels (optionnel)
 * @param category - Catégorie du log pour filtrage (optionnel)
 * @returns True si le log a été enregistré avec succès
 */
export const writeLog = async (
  message: string,
  level: LogLevel = 'info',
  details?: string,
  category: string = 'general'
): Promise<boolean> => {
  try {
    // Get current user if available
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;
    
    // Create log entry
    const logEntry: LogEntry = {
      id: uuidv4(),
      message,
      level,
      details,
      category,
      user_id: userId,
      created_at: new Date().toISOString()
    };
    
    // Insert into logs table
    const { error } = await supabase
      .from('logs')
      .insert(logEntry);
    
    if (error) {
      console.error("Erreur lors de l'enregistrement du log:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Erreur lors de l'écriture du log:", error);
    return false;
  }
};

/**
 * Initialise la table de logs si elle n'existe pas
 */
export const initializeLogsSystem = async (): Promise<boolean> => {
  try {
    // Try to select from logs table to see if it exists
    const { error } = await supabase
      .from('logs')
      .select('id')
      .limit(1);
    
    // If table doesn't exist, create it
    if (error && error.code === '42P01') {
      await createLogsTable();
    } else if (error) {
      console.error("Erreur lors de la vérification de la table logs:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Erreur lors de l'initialisation du système de logs:", error);
    return false;
  }
};

/**
 * Crée la table logs
 */
const createLogsTable = async (): Promise<void> => {
  try {
    // Create logs table
    await supabase.rpc('create_table', {
      table_name: 'logs',
      columns: `
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        message TEXT NOT NULL,
        level TEXT NOT NULL,
        details TEXT,
        category TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        user_id UUID REFERENCES auth.users(id)
      `
    });
    
    // Add RLS policies
    await supabase.rpc('exec_sql', {
      query: `
        ALTER TABLE public.logs ENABLE ROW LEVEL SECURITY;
        
        -- Allow authenticated users to view logs
        CREATE POLICY "Allow administrators to see logs" 
          ON public.logs 
          FOR SELECT 
          USING (auth.uid() IN (
            SELECT auth.uid() FROM auth.users 
            WHERE auth.email() = ANY (ARRAY['admin@example.com', 'admin@admin.com'])
          ));
          
        -- Allow authenticated users to insert their logs
        CREATE POLICY "Allow users to insert their logs" 
          ON public.logs 
          FOR INSERT 
          WITH CHECK (auth.role() = 'authenticated');
      `
    });
    
    console.log("Table logs créée avec succès");
  } catch (error) {
    console.error("Erreur lors de la création de la table logs:", error);
    throw error;
  }
};

/**
 * Récupère les logs avec pagination et filtres
 */
export const fetchLogs = async (
  page: number = 1,
  limit: number = 20,
  filters?: {
    level?: LogLevel,
    category?: string,
    startDate?: string,
    endDate?: string,
    search?: string
  }
): Promise<{ logs: LogEntry[], count: number }> => {
  try {
    let query = supabase
      .from('logs')
      .select('*', { count: 'exact' });
    
    // Apply filters if provided
    if (filters) {
      if (filters.level) {
        query = query.eq('level', filters.level);
      }
      
      if (filters.category) {
        query = query.eq('category', filters.category);
      }
      
      if (filters.startDate) {
        query = query.gte('created_at', filters.startDate);
      }
      
      if (filters.endDate) {
        query = query.lte('created_at', filters.endDate);
      }
      
      if (filters.search) {
        query = query.or(`message.ilike.%${filters.search}%,details.ilike.%${filters.search}%`);
      }
    }
    
    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to);
    
    if (error) {
      console.error("Erreur lors de la récupération des logs:", error);
      throw error;
    }
    
    return {
      logs: data || [],
      count: count || 0
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des logs:", error);
    throw error;
  }
};

/**
 * Récupère les catégories uniques de logs
 */
export const fetchLogCategories = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .rpc('get_unique_log_categories');
    
    if (error) {
      console.error("Erreur lors de la récupération des catégories de logs:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Erreur lors de la récupération des catégories de logs:", error);
    return [];
  }
};


import { supabase } from "@/lib/supabase";
import { fetchWithRetry } from "@/services/network/retryUtils";

/**
 * Récupérer les détails d'un défi par son ID
 */
export const fetchDefiById = async (defiId: number) => {
  try {
    const { data, error } = await fetchWithRetry(
      async () => {
        return await supabase
          .from('defis')
          .select('*')
          .eq('id', defiId)
          .single();
      }
    );
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération du défi:", error);
    return null;
  }
};

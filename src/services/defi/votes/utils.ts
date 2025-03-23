
import { supabase } from "@/lib/supabase";
import { fetchWithRetry } from "@/services/network/retryUtils";

/**
 * Récupérer la session utilisateur courante
 */
export const getCurrentUser = async () => {
  const { data: { session }, error } = await fetchWithRetry(
    async () => {
      return await supabase.auth.getSession();
    }
  );
  
  if (error) throw error;
  
  return session?.user?.id;
};

/**
 * Calcule le score basé sur les votes positifs et négatifs
 */
export const calculateScore = (votes: { up: number; down: number }): number => {
  return votes.up - votes.down;
};

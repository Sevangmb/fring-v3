
import { supabase } from '@/lib/supabase';
import { VoteCount } from '@/services/votes/types';

/**
 * Récupère l'ID de l'utilisateur actuel
 */
export const getCurrentUser = async (): Promise<string | null> => {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user?.id || null;
};

/**
 * Calcule le score à partir du décompte des votes
 */
export const calculateScore = (votes: VoteCount): number => {
  return votes.up - votes.down;
};

/**
 * Récupère les informations d'un défi par son ID
 */
export const fetchDefiById = async (defiId: number) => {
  try {
    const { data, error } = await supabase
      .from('defis')
      .select('*')
      .eq('id', defiId)
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Erreur lors de la récupération du défi ${defiId}:`, error);
    return null;
  }
};

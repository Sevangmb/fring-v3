
import { supabase } from '@/lib/supabase';
import { Vetement } from './types';

/**
 * Récupère un vêtement par son ID
 */
export const fetchVetementById = async (vetementId: number): Promise<Vetement | null> => {
  try {
    const { data, error } = await supabase
      .from('vetements')
      .select('*')
      .eq('id', vetementId)
      .single();

    if (error) {
      console.error("Erreur lors de la récupération du vêtement:", error);
      // Si le vêtement n'existe pas, on retourne null plutôt que de lancer une erreur
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }

    if (!data) {
      return null;
    }

    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération du vêtement:", error);
    return null;
  }
};

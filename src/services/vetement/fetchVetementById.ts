
import { supabase } from '@/lib/supabase';
import { Vetement } from './types';

/**
 * Récupère un vêtement par son ID
 */
export const fetchVetementById = async (vetementId: number): Promise<Vetement | null> => {
  try {
    const { data, error } = await supabase
      .from('vetements')
      .select('*, profiles:user_id(email)')
      .eq('id', vetementId)
      .single();

    if (error) {
      console.error("Erreur lors de la récupération du vêtement:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération du vêtement:", error);
    return null;
  }
};

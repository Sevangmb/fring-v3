
import { supabase } from '@/lib/supabase';
import { Vetement } from './types';

/**
 * Updates an existing vetement
 */
export const updateVetement = async (id: number, vetement: Partial<Vetement>): Promise<Vetement> => {
  try {
    const { data, error } = await supabase
      .from('vetements')
      .update(vetement)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Erreur lors de la mise à jour d\'un vêtement:', error);
      throw error;
    }
    
    return data as Vetement;
  } catch (error) {
    console.error('Erreur lors de la mise à jour d\'un vêtement:', error);
    throw error;
  }
};

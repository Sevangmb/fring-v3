
import { supabase } from '@/lib/supabase';

/**
 * Deletes a vetement by its ID
 */
export const deleteVetement = async (id: number): Promise<void> => {
  try {
    const { error } = await supabase
      .from('vetements')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Erreur lors de la suppression d\'un vêtement:', error);
      throw error;
    }
  } catch (error) {
    console.error('Erreur lors de la suppression d\'un vêtement:', error);
    throw error;
  }
};

// Export default for compatibility with existing code
export default deleteVetement;

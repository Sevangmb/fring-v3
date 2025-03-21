
import { supabase } from '@/lib/supabase';
import { Vetement } from './types';

/**
 * Adds a new vetement to the database
 */
export const addVetement = async (vetement: Omit<Vetement, 'id' | 'created_at'>): Promise<Vetement> => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;

    if (!userId) {
      throw new Error('Vous devez être connecté pour ajouter un vêtement');
    }

    const { data, error } = await supabase
      .from('vetements')
      .insert([{ ...vetement, user_id: userId }])
      .select()
      .single();
    
    if (error) {
      console.error('Erreur lors de l\'ajout d\'un vêtement:', error);
      throw error;
    }
    
    return data as Vetement;
  } catch (error) {
    console.error('Erreur lors de l\'ajout d\'un vêtement:', error);
    throw error;
  }
};

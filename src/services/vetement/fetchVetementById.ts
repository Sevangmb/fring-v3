
import { supabase } from '@/lib/supabase';
import { Vetement } from './types';

/**
 * Récupère un vêtement par son ID
 */
export const fetchVetementById = async (vetementId: number): Promise<Vetement | null> => {
  try {
    // Modification de la requête pour éviter de joindre sur user_id qui n'est pas une table
    const { data, error } = await supabase
      .from('vetements')
      .select('*, profiles(email)')
      .eq('id', vetementId)
      .single();

    if (error) {
      console.error("Erreur lors de la récupération du vêtement:", error);
      throw error;
    }

    // Transformer la réponse pour maintenir la structure attendue
    const vetementData = {
      ...data,
      owner_email: data.profiles?.email
    };

    return vetementData;
  } catch (error) {
    console.error("Erreur lors de la récupération du vêtement:", error);
    return null;
  }
};

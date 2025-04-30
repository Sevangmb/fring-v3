
import { supabase } from '@/lib/supabase';
import { Defi } from '../types';

/**
 * Récupère un défi par son ID
 * @param id ID du défi
 * @returns Défi ou null si non trouvé
 */
export const fetchDefiById = async (id: number): Promise<Defi | null> => {
  try {
    const { data, error } = await supabase
      .from('defis')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Erreur lors de la récupération du défi ${id}:`, error);
      return null;
    }
    
    return data as Defi;
  } catch (error) {
    console.error(`Erreur lors de la récupération du défi ${id}:`, error);
    return null;
  }
};

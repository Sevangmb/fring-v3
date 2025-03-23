
import { supabase } from '@/lib/supabase';

export interface Defi {
  id: number;
  titre: string;
  description: string;
  date_debut: string;
  date_fin: string;
  user_id: string | null;
  participants_count: number;
  status: 'current' | 'upcoming' | 'past';
  created_at: string;
  ensemble_id?: number; // Added optional ensemble_id property
}

/**
 * Récupère tous les défis
 */
export const fetchDefis = async (): Promise<Defi[]> => {
  try {
    const { data, error } = await supabase
      .from('defis')
      .select('*')
      .order('date_debut', { ascending: false });
    
    if (error) {
      console.error('Erreur lors de la récupération des défis:', error);
      return [];
    }
    
    return data as Defi[];
  } catch (error) {
    console.error('Erreur lors de la récupération des défis:', error);
    return [];
  }
};

/**
 * Crée un nouveau défi
 */
export const createDefi = async (defi: Omit<Defi, 'id' | 'created_at' | 'user_id'>): Promise<Defi | null> => {
  try {
    // Récupérer l'utilisateur actuel
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    
    if (!userId) {
      throw new Error('Vous devez être connecté pour créer un défi');
    }
    
    const { data, error } = await supabase
      .from('defis')
      .insert({
        ...defi,
        user_id: userId
      })
      .select()
      .single();
    
    if (error) {
      console.error('Erreur lors de la création du défi:', error);
      return null;
    }
    
    return data as Defi;
  } catch (error) {
    console.error('Erreur lors de la création du défi:', error);
    return null;
  }
};

/**
 * Récupère un défi par son ID
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

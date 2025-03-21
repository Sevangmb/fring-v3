
import { supabase } from '@/lib/supabase';

// Type pour une marque
export interface Marque {
  id: number;
  nom: string;
  site_web?: string;
  logo_url?: string;
  created_at: string;
}

// Fonction pour récupérer toutes les marques
export const fetchMarques = async (): Promise<Marque[]> => {
  try {
    const { data, error } = await supabase
      .from('marques')
      .select('*')
      .order('nom');
    
    if (error) {
      console.error('Erreur lors de la récupération des marques:', error);
      throw error;
    }
    
    return data as Marque[];
  } catch (error) {
    console.error('Erreur lors de la récupération des marques:', error);
    throw error;
  }
};

// Fonction pour ajouter une marque
export const addMarque = async (marque: Omit<Marque, 'id' | 'created_at'>): Promise<Marque> => {
  try {
    const { data, error } = await supabase
      .from('marques')
      .insert([marque])
      .select()
      .single();
    
    if (error) {
      console.error('Erreur lors de l\'ajout d\'une marque:', error);
      throw error;
    }
    
    return data as Marque;
  } catch (error) {
    console.error('Erreur lors de l\'ajout d\'une marque:', error);
    throw error;
  }
};

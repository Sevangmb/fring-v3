
import { supabase } from '@/lib/supabase';

// Type pour une catégorie
export interface Categorie {
  id: number;
  nom: string;
  description?: string;
  created_at: string;
}

// Fonction pour récupérer toutes les catégories
export const fetchCategories = async (): Promise<Categorie[]> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('nom');
    
    if (error) {
      console.error('Erreur lors de la récupération des catégories:', error);
      throw error;
    }
    
    return data as Categorie[];
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error);
    throw error;
  }
};

// Fonction pour ajouter une catégorie
export const addCategorie = async (categorie: Omit<Categorie, 'id' | 'created_at'>): Promise<Categorie> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .insert([categorie])
      .select()
      .single();
    
    if (error) {
      console.error('Erreur lors de l\'ajout d\'une catégorie:', error);
      throw error;
    }
    
    return data as Categorie;
  } catch (error) {
    console.error('Erreur lors de l\'ajout d\'une catégorie:', error);
    throw error;
  }
};

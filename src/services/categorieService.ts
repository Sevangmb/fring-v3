
import { supabase } from '@/lib/supabase';

/**
 * Interface for Categorie
 */
export interface Categorie {
  id: number | string;
  nom: string;
  description?: string | null;
}

/**
 * Initialise la table des catégories
 */
export const initializeCategories = async (): Promise<boolean> => {
  try {
    const categories = [
      { nom: 'T-shirts', description: 'T-shirts et hauts à manches courtes' },
      { nom: 'Pantalons', description: 'Pantalons, jeans et shorts' },
      { nom: 'Chaussures', description: 'Chaussures, baskets et bottes' },
      { nom: 'Vestes', description: 'Vestes, manteaux et pulls' },
      { nom: 'Accessoires', description: 'Accessoires, chapeaux, écharpes, etc.' }
    ];

    const { error } = await supabase
      .from('categories')
      .insert(categories);

    if (error) {
      console.error('Erreur lors de l\'initialisation des catégories:', error);
      return false;
    }

    console.log('Catégories initialisées avec succès');
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'initialisation des catégories:', error);
    return false;
  }
};

/**
 * Récupère toutes les catégories
 */
export const fetchCategories = async (): Promise<Categorie[]> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*');

    if (error) {
      console.error('Erreur lors de la récupération des catégories:', error);
      throw new Error('Impossible de récupérer les catégories');
    }

    return data || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error);
    throw new Error('Impossible de récupérer les catégories');
  }
};

/**
 * Ajoute une nouvelle catégorie
 */
export const addCategorie = async (categorie: Partial<Categorie>): Promise<Categorie> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .insert(categorie)
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de l\'ajout de la catégorie:', error);
      throw new Error('Impossible d\'ajouter la catégorie');
    }

    return data;
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la catégorie:', error);
    throw new Error('Impossible d\'ajouter la catégorie');
  }
};

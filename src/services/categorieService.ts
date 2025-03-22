
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
    const { data: existingCategories, error: checkError } = await supabase
      .from('categories')
      .select('id')
      .limit(1);
      
    if (checkError) {
      console.error('Erreur lors de la vérification des catégories:', checkError);
      return false;
    }
    
    // Si des catégories existent déjà, ne pas réinitialiser
    if (existingCategories && existingCategories.length > 0) {
      console.log('Des catégories existent déjà, pas d\'initialisation nécessaire');
      return true;
    }

    const categories = [
      { nom: 'T-shirt', description: 'T-shirts et hauts à manches courtes' },
      { nom: 'Chemise', description: 'Chemises à manches longues ou courtes' },
      { nom: 'Pull', description: 'Pulls, sweats et gilets' },
      { nom: 'Veste', description: 'Vestes légères et blousons' },
      { nom: 'Manteau', description: 'Manteaux et parkas pour l\'hiver' },
      { nom: 'Pantalon', description: 'Pantalons longs' },
      { nom: 'Jean', description: 'Jeans et pantalons en denim' },
      { nom: 'Short', description: 'Shorts et bermudas' },
      { nom: 'Jupe', description: 'Jupes de toutes longueurs' },
      { nom: 'Robe', description: 'Robes pour toutes occasions' },
      { nom: 'Chaussures', description: 'Chaussures, baskets et bottes' },
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
      .select('*')
      .order('nom');

    if (error) {
      console.error('Erreur lors de la récupération des catégories:', error);
      throw new Error('Impossible de récupérer les catégories');
    }

    console.log('Catégories récupérées:', data);
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

/**
 * Récupère une catégorie par son ID
 */
export const getCategorieById = async (categorieId: number): Promise<Categorie | null> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', categorieId)
      .single();

    if (error) {
      console.error('Erreur lors de la récupération de la catégorie:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération de la catégorie:', error);
    return null;
  }
};

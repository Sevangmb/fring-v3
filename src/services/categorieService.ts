
import { supabase } from '@/lib/supabase';

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

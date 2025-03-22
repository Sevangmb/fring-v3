
import { supabase } from '@/lib/supabase';

/**
 * Initialise la table des marques
 */
export const initializeMarques = async (): Promise<boolean> => {
  try {
    const marques = [
      { nom: 'Nike', site_web: 'https://www.nike.com' },
      { nom: 'Adidas', site_web: 'https://www.adidas.com' },
      { nom: 'Zara', site_web: 'https://www.zara.com' },
      { nom: 'H&M', site_web: 'https://www.hm.com' },
      { nom: 'Uniqlo', site_web: 'https://www.uniqlo.com' }
    ];

    const { error } = await supabase
      .from('marques')
      .insert(marques);

    if (error) {
      console.error('Erreur lors de l\'initialisation des marques:', error);
      return false;
    }

    console.log('Marques initialisées avec succès');
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'initialisation des marques:', error);
    return false;
  }
};

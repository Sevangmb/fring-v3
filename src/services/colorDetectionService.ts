
import { supabase } from '@/lib/supabase';

/**
 * Service pour détecter la couleur dominante d'une image
 * @param imageUrl URL de l'image à analyser
 * @returns La couleur dominante détectée
 */
export const detectImageColor = async (imageUrl: string): Promise<string> => {
  try {
    const { data, error } = await supabase.functions.invoke('detect-color', {
      body: { imageUrl },
    });

    if (error) {
      console.error('Erreur lors de la détection de couleur:', error);
      throw error;
    }

    return data?.color || 'multicolore';
  } catch (error) {
    console.error('Erreur lors de la détection de couleur:', error);
    return 'multicolore'; // Valeur par défaut en cas d'erreur
  }
};

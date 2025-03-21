
import { supabase } from '@/lib/supabase';

/**
 * Service pour détecter la couleur dominante d'une image de vêtement en utilisant Hugging Face
 * @param imageUrl URL de l'image à analyser
 * @returns La couleur dominante du vêtement détectée
 */
export const detectImageColor = async (imageUrl: string): Promise<string> => {
  try {
    // Afficher un message indiquant que la détection de couleur est en cours
    console.log('Détection de couleur du vêtement en cours avec Hugging Face...');
    
    const { data, error } = await supabase.functions.invoke('detect-color', {
      body: { imageUrl },
    });

    if (error) {
      console.error('Erreur lors de la détection de couleur:', error);
      throw error;
    }

    // Afficher la couleur détectée dans la console pour déboguer
    console.log('Couleur détectée:', data?.color);
    
    return data?.color || 'multicolore';
  } catch (error) {
    console.error('Erreur lors de la détection de couleur:', error);
    return 'multicolore'; // Valeur par défaut en cas d'erreur
  }
};

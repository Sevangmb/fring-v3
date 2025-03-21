
import { supabase } from '@/lib/supabase';

/**
 * Service pour détecter la couleur et la catégorie dominante d'une image de vêtement
 * @param imageUrl URL de l'image à analyser
 * @returns Les informations détectées (couleur et catégorie)
 */
export const detectImageInfo = async (imageUrl: string): Promise<{color: string, category: string}> => {
  try {
    // Afficher un message indiquant que la détection est en cours
    console.log('Détection des informations du vêtement en cours...');
    
    // S'assurer que l'URL de l'image est correctement formatée pour l'API
    const imageUrlToSend = imageUrl.startsWith('data:') 
      ? imageUrl // Si c'est déjà en base64, on l'envoie tel quel
      : imageUrl; // Sinon on envoie l'URL

    const { data, error } = await supabase.functions.invoke('detect-color', {
      body: { imageUrl: imageUrlToSend },
    });

    if (error) {
      console.error('Erreur lors de la détection:', error);
      throw error;
    }

    // Afficher les informations détectées dans la console pour déboguer
    console.log('Couleur détectée:', data?.color);
    console.log('Catégorie détectée:', data?.category);
    
    return {
      color: data?.color || 'bleu',
      category: data?.category || 'T-shirt'
    };
  } catch (error) {
    console.error('Erreur lors de la détection:', error);
    return {
      color: 'bleu',
      category: 'T-shirt'
    };
  }
};

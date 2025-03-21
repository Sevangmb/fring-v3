
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
    
    // S'assurer que l'URL de l'image est correctement formatée pour l'API
    const imageUrlToSend = imageUrl.startsWith('data:') 
      ? imageUrl // Si c'est déjà en base64, on l'envoie tel quel
      : imageUrl; // Sinon on envoie l'URL

    const { data, error } = await supabase.functions.invoke('detect-color', {
      body: { imageUrl: imageUrlToSend },
    });

    if (error) {
      console.error('Erreur lors de la détection de couleur:', error);
      throw error;
    }

    // Afficher la couleur détectée dans la console pour déboguer
    console.log('Couleur détectée:', data?.color);
    
    // Si c'est un pantalon/jeans (détecté par la fonction), on retourne toujours bleu
    return data?.color || 'bleu';
  } catch (error) {
    console.error('Erreur lors de la détection de couleur:', error);
    return 'bleu'; // Valeur par défaut en cas d'erreur (souvent les vêtements sont bleus)
  }
};

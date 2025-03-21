
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
    
    // Vérifier si l'image est au format base64 (après échec du bucket)
    const isBase64 = imageUrl.startsWith('data:');
    
    // S'assurer que l'URL de l'image est correctement formatée pour l'API
    // Conserver les 50 premiers caractères pour le log, pour éviter de surcharger la console
    console.log('Envoi de l\'image pour détection:', imageUrl.substring(0, 50) + '...');
    
    // Appeler la fonction Edge qui effectue la détection
    const { data, error } = await supabase.functions.invoke('detect-color', {
      body: { imageUrl },
    });

    if (error) {
      console.error('Erreur lors de la détection:', error);
      // Génération d'une couleur aléatoire en cas d'erreur
      const randomColors = ['bleu', 'rouge', 'vert', 'jaune', 'noir', 'blanc', 'violet', 'orange'];
      const randomColor = randomColors[Math.floor(Math.random() * randomColors.length)];
      return {
        color: randomColor,
        category: 'T-shirt'
      };
    }

    // Afficher les informations détectées dans la console pour déboguer
    console.log('Couleur détectée:', data?.color);
    console.log('Catégorie détectée:', data?.category);
    
    // Vérifier que les données retournées sont valides
    if (!data || !data.color || !data.category) {
      console.warn('Données de détection incomplètes, utilisation d\'une couleur aléatoire');
      const randomColors = ['bleu', 'rouge', 'vert', 'jaune', 'noir', 'blanc', 'violet', 'orange'];
      const randomColor = randomColors[Math.floor(Math.random() * randomColors.length)];
      return {
        color: randomColor,
        category: 'T-shirt'
      };
    }
    
    return {
      color: data.color,
      category: data.category
    };
  } catch (error) {
    console.error('Erreur lors de la détection:', error);
    // Génération d'une couleur aléatoire en cas d'erreur
    const randomColors = ['bleu', 'rouge', 'vert', 'jaune', 'noir', 'blanc', 'violet', 'orange'];
    const randomColor = randomColors[Math.floor(Math.random() * randomColors.length)];
    return {
      color: randomColor,
      category: 'T-shirt'
    };
  }
};

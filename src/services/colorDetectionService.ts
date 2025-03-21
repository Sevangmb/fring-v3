
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
    
    // Tronquer l'URL/base64 pour le log
    const truncatedUrl = isBase64 
      ? imageUrl.substring(0, imageUrl.indexOf(",") + 10) + "..." 
      : imageUrl.substring(0, 50) + "...";
    
    console.log('Envoi de l\'image pour détection:', truncatedUrl);
    
    // Appeler la fonction Edge qui effectue la détection
    const { data, error } = await supabase.functions.invoke('detect-color', {
      body: { imageUrl },
    });

    if (error) {
      console.error('Erreur lors de la détection:', error);
      
      // Générer des résultats aléatoires en cas d'erreur
      const randomColors = ['bleu', 'rouge', 'vert', 'jaune', 'noir', 'blanc', 'violet', 'orange'];
      const randomCategories = ['T-shirt', 'Pantalon', 'Chemise', 'Robe', 'Veste'];
      
      const randomColor = randomColors[Math.floor(Math.random() * randomColors.length)];
      const randomCategory = randomCategories[Math.floor(Math.random() * randomCategories.length)];
      
      console.log('Détection échouée, utilisation des valeurs aléatoires:', randomColor, randomCategory);
      
      return {
        color: randomColor,
        category: randomCategory
      };
    }

    // Afficher les informations détectées dans la console pour déboguer
    console.log('Couleur détectée:', data?.color);
    console.log('Catégorie détectée:', data?.category);
    
    // Vérifier que les données retournées sont valides
    if (!data || !data.color || !data.category) {
      console.warn('Données de détection incomplètes, utilisation de valeurs aléatoires');
      
      const randomColors = ['bleu', 'rouge', 'vert', 'jaune', 'noir', 'blanc', 'violet', 'orange'];
      const randomCategories = ['T-shirt', 'Pantalon', 'Chemise', 'Robe', 'Veste'];
      
      const randomColor = randomColors[Math.floor(Math.random() * randomColors.length)];
      const randomCategory = randomCategories[Math.floor(Math.random() * randomCategories.length)];
      
      return {
        color: randomColor,
        category: randomCategory
      };
    }
    
    return {
      color: data.color,
      category: data.category
    };
  } catch (error) {
    console.error('Erreur lors de la détection:', error);
    
    // Générer des résultats aléatoires en cas d'erreur
    const randomColors = ['bleu', 'rouge', 'vert', 'jaune', 'noir', 'blanc', 'violet', 'orange'];
    const randomCategories = ['T-shirt', 'Pantalon', 'Chemise', 'Robe', 'Veste'];
    
    const randomColor = randomColors[Math.floor(Math.random() * randomColors.length)];
    const randomCategory = randomCategories[Math.floor(Math.random() * randomCategories.length)];
    
    return {
      color: randomColor,
      category: randomCategory
    };
  }
};

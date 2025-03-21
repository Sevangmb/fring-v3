
import { supabase } from '@/lib/supabase';

/**
 * Creates demo vetements for a new user
 */
export const createDemoVetementsForUser = async (): Promise<boolean> => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;

    if (!userId) {
      console.error('Utilisateur non connecté');
      return false;
    }

    // Vérifier si l'utilisateur a déjà des vêtements
    const { data: countData, error: countError } = await supabase
      .rpc('check_user_has_vetements', { user_id_param: userId });
    
    if (countError) {
      console.error('Erreur lors de la vérification des vêtements:', countError);
      return false;
    }
    
    // Si l'utilisateur a déjà des vêtements, ne rien faire
    if (countData && countData > 0) {
      console.log('L\'utilisateur a déjà des vêtements, pas besoin d\'ajouter des démos');
      return false;
    }
    
    console.log('Ajout de vêtements de démo pour l\'utilisateur:', userId);
    
    // Données de démo à ajouter
    const demoVetements = [
      {
        nom: 'T-shirt blanc',
        categorie: 't-shirt',
        couleur: 'blanc',
        taille: 'M',
        description: 'T-shirt basique en coton bio',
        marque: 'Nike',
        user_id: userId
      },
      {
        nom: 'Jean bleu',
        categorie: 'jeans',
        couleur: 'bleu',
        taille: '40',
        description: 'Jean slim en denim stretch',
        marque: 'Levi\'s',
        user_id: userId
      },
      {
        nom: 'Veste noire',
        categorie: 'veste',
        couleur: 'noir',
        taille: 'L',
        description: 'Veste légère pour la mi-saison',
        marque: 'Zara',
        user_id: userId
      },
      {
        nom: 'Pull gris',
        categorie: 'pull',
        couleur: 'gris',
        taille: 'S',
        description: 'Pull chaud en laine mélangée',
        marque: 'H&M',
        user_id: userId
      }
    ];
    
    // Insérer les vêtements de démo
    const { error } = await supabase
      .from('vetements')
      .insert(demoVetements);
    
    if (error) {
      console.error('Erreur lors de l\'ajout des vêtements de démo:', error);
      return false;
    }
    
    console.log('Vêtements de démo ajoutés avec succès');
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'ajout des vêtements de démo:', error);
    return false;
  }
};

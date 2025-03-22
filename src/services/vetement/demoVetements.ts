
import { supabase } from '@/lib/supabase';
import { Vetement } from './types';

/**
 * Ajoute des vêtements de démonstration à la base de données
 */
export const addDemoVetements = async (): Promise<boolean> => {
  try {
    const demoVetements: Partial<Vetement>[] = [
      {
        nom: 'T-shirt blanc',
        categorie_id: 1, // Supposons que 1 est l'ID pour les T-shirts
        couleur: 'blanc',
        taille: 'M',
        marque: 'Basique',
        description: 'T-shirt blanc basique',
        temperature: 'tempere',
        weather_type: 'normal'
      },
      {
        nom: 'Jean bleu',
        categorie_id: 2, // Supposons que 2 est l'ID pour les pantalons
        couleur: 'bleu',
        taille: '40',
        marque: 'Jeaniste',
        description: 'Jean bleu classique',
        temperature: 'tempere',
        weather_type: 'normal'
      },
      {
        nom: 'Baskets noires',
        categorie_id: 3, // Supposons que 3 est l'ID pour les chaussures
        couleur: 'noir',
        taille: '42',
        marque: 'SportPlus',
        description: 'Baskets noires confortables',
        temperature: 'tempere',
        weather_type: 'normal'
      }
    ];

    // Insérer les vêtements de démonstration
    const { error } = await supabase
      .from('vetements')
      .insert(demoVetements);

    if (error) {
      console.error('Erreur lors de l\'ajout des vêtements de démonstration:', error);
      return false;
    }

    console.log('Vêtements de démonstration ajoutés avec succès');
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'ajout des vêtements de démonstration:', error);
    return false;
  }
};

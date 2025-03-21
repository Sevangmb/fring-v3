
import { supabase } from '@/lib/supabase';
import { Vetement } from './types';

/**
 * Updates an existing vetement with the given ID
 */
export const updateVetement = async (id: number, vetement: Partial<Vetement>): Promise<Vetement> => {
  try {
    // Vérification des paramètres
    if (!id || isNaN(id)) {
      throw new Error('ID de vêtement invalide');
    }
    
    if (!vetement || Object.keys(vetement).length === 0) {
      throw new Error('Données de vêtement invalides');
    }

    console.log('===== DÉBUT MISE À JOUR VÊTEMENT =====');
    console.log('ID:', id);
    console.log('Données reçues:', JSON.stringify(vetement, null, 2));
    
    // APPROCHE DIRECTE : Envoyer les données telles quelles à Supabase
    const { data, error } = await supabase
      .from('vetements')
      .update(vetement)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('ERREUR Supabase:', error);
      throw error;
    }
    
    console.log('Réponse Supabase:', data);
    console.log('===== FIN MISE À JOUR VÊTEMENT =====');
    
    return data as Vetement;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du vêtement:', error);
    throw error;
  }
};

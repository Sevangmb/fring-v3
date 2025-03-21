
import { supabase } from '@/lib/supabase';
import { Vetement } from './types';

/**
 * Updates an existing vetement
 */
export const updateVetement = async (id: number, vetement: Partial<Vetement>): Promise<Vetement> => {
  try {
    console.log('Mise à jour du vêtement :', id, vetement);
    
    // Vérifier que l'ID est valide
    if (!id || isNaN(id)) {
      throw new Error('ID de vêtement invalide');
    }
    
    // Vérifier que les données à mettre à jour sont valides
    if (!vetement || Object.keys(vetement).length === 0) {
      throw new Error('Données de vêtement invalides');
    }
    
    const { data, error } = await supabase
      .from('vetements')
      .update(vetement)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Erreur lors de la mise à jour d\'un vêtement:', error);
      throw error;
    }
    
    console.log('Vêtement mis à jour avec succès:', data);
    return data as Vetement;
  } catch (error) {
    console.error('Erreur lors de la mise à jour d\'un vêtement:', error);
    throw error;
  }
};

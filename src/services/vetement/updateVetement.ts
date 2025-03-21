
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
    console.log('Données envoyées pour mise à jour:', JSON.stringify(vetement, null, 2));
    
    // Récupérer les données actuelles du vêtement pour ne mettre à jour que ce qui a changé
    const { data: existingData, error: fetchError } = await supabase
      .from('vetements')
      .select('*')
      .eq('id', id)
      .single();
      
    if (fetchError) {
      console.error('ERREUR lors de la récupération du vêtement:', fetchError);
      throw fetchError;
    }
    
    console.log('Données existantes:', JSON.stringify(existingData, null, 2));
    
    // Si le vêtement a une catégorie mais pas de température, déduire la température
    if (vetement.categorie && !vetement.temperature) {
      try {
        // Importer dynamiquement la fonction
        const { determineTemperatureFromCategory } = await import('../../components/vetements/form-fields/TemperatureField');
        const temperature = determineTemperatureFromCategory(vetement.categorie);
        if (temperature) {
          console.log('Température déduite de la catégorie:', temperature);
          vetement.temperature = temperature;
        }
      } catch (error) {
        console.error('Erreur lors de la déduction de la température:', error);
      }
    }
    
    // Nettoyer les données avant la mise à jour
    const cleanedData = {};
    Object.entries(vetement).forEach(([key, value]) => {
      // Ne pas inclure les propriétés undefined ou null qui ne sont pas explicitement définies à null
      if (value !== undefined) {
        cleanedData[key] = value;
      }
    });
    
    console.log('Données nettoyées pour mise à jour:', JSON.stringify(cleanedData, null, 2));
    
    // Faire la mise à jour avec les nouvelles données
    const { data, error } = await supabase
      .from('vetements')
      .update(cleanedData)
      .eq('id', id)
      .select('*')
      .single();
    
    if (error) {
      console.error('ERREUR Supabase lors de la mise à jour:', error);
      throw error;
    }
    
    console.log('Réponse Supabase après mise à jour:', data);
    console.log('===== FIN MISE À JOUR VÊTEMENT =====');
    
    return data as Vetement;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du vêtement:', error);
    throw error;
  }
};


import { supabase } from '@/lib/supabase';
import { Ensemble } from './types';

/**
 * Récupère un ensemble par son ID
 */
export const fetchEnsembleById = async (id: number): Promise<Ensemble | null> => {
  try {
    console.log(`Fetching ensemble with id: ${id}`);
    const { data: ensembleData, error: ensembleError } = await supabase
      .from('tenues')
      .select(`
        *,
        tenues_vetements:tenues_vetements(
          id,
          position_ordre,
          vetement:vetement_id(
            id,
            nom,
            description, 
            image_url, 
            couleur,
            marque,
            taille,
            categorie_id
          )
        )
      `)
      .eq('id', id)
      .single();
    
    if (ensembleError) {
      console.error("Error fetching ensemble by ID:", ensembleError);
      throw ensembleError;
    }
    
    if (!ensembleData) {
      return null;
    }
    
    // Transforme les données pour avoir une structure plus simple
    return {
      id: ensembleData.id,
      nom: ensembleData.nom,
      description: ensembleData.description,
      occasion: ensembleData.occasion,
      saison: ensembleData.saison,
      created_at: ensembleData.created_at,
      user_id: ensembleData.user_id,
      vetements: ensembleData.tenues_vetements || []
    };
  } catch (error) {
    console.error("Error fetching ensemble by ID:", error);
    return null;
  }
};

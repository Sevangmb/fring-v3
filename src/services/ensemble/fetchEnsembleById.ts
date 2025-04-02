
import { supabase } from '@/lib/supabase';
import { Ensemble } from './types';

/**
 * Récupère un ensemble par son ID
 */
export const fetchEnsembleById = async (id: number): Promise<Ensemble | null> => {
  try {
    const { data: ensembleData, error: ensembleError } = await supabase
      .from('tenues')
      .select(`
        *,
        tenues_vetements:tenues_vetements(
          *,
          vetement:vetement_id(*)
        )
      `)
      .eq('id', id)
      .single();
    
    if (ensembleError) {
      console.error("Erreur lors de la récupération de l'ensemble:", ensembleError);
      throw ensembleError;
    }
    
    if (!ensembleData) {
      return null;
    }
    
    return {
      id: ensembleData.id,
      nom: ensembleData.nom,
      description: ensembleData.description,
      occasion: ensembleData.occasion,
      saison: ensembleData.saison,
      created_at: ensembleData.created_at,
      vetements: ensembleData.tenues_vetements,
      user_id: ensembleData.user_id
    };
  } catch (error) {
    console.error("Erreur lors de la récupération de l'ensemble:", error);
    return null;
  }
};

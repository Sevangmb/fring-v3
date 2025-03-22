
import { supabase } from '@/lib/supabase';
import { Ensemble } from './types';

/**
 * Récupère un ensemble par son ID
 */
export const fetchEnsembleById = async (ensembleId: number): Promise<Ensemble | null> => {
  try {
    const { data: ensembleData, error: ensembleError } = await supabase
      .from('tenues')
      .select('*')
      .eq('id', ensembleId)
      .single();

    if (ensembleError) {
      console.error("Erreur lors de la récupération de l'ensemble:", ensembleError);
      throw ensembleError;
    }

    // Récupérer les vêtements associés à cet ensemble
    const { data: vetementsData, error: vetementsError } = await supabase
      .from('tenues_vetements')
      .select(`
        *,
        vetement:vetement_id(*)
      `)
      .eq('tenue_id', ensembleId)
      .order('position_ordre', { ascending: true });

    if (vetementsError) {
      console.error("Erreur lors de la récupération des vêtements de l'ensemble:", vetementsError);
      throw vetementsError;
    }

    return {
      ...ensembleData,
      vetements: vetementsData || []
    };
  } catch (error) {
    console.error("Erreur lors de la récupération de l'ensemble:", error);
    return null;
  }
};

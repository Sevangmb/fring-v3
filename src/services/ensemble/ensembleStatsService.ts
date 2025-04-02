
import { supabase } from '@/lib/supabase';

interface EnsembleStats {
  totalCount: number;
  byCategory: {
    id: number;
    nom: string;
    count: number;
  }[];
  byOccasion: {
    occasion: string;
    count: number;
  }[];
  bySaison: {
    saison: string;
    count: number;
  }[];
}

/**
 * Récupère les statistiques des ensembles de l'utilisateur
 */
export const getEnsembleStats = async (userId: string): Promise<EnsembleStats> => {
  try {
    // Récupérer le nombre total d'ensembles
    const { count: totalCount, error: countError } = await supabase
      .from('tenues')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (countError) {
      console.error('Error getting total ensemble count:', countError);
      throw countError;
    }

    // Statistiques par saison
    const { data: saisonData, error: saisonError } = await supabase
      .from('tenues')
      .select('saison')
      .eq('user_id', userId)
      .not('saison', 'is', null);

    if (saisonError) {
      console.error('Error getting saison stats:', saisonError);
      throw saisonError;
    }

    const saisonCounts: Record<string, number> = {};
    saisonData.forEach(ensemble => {
      const saison = ensemble.saison || 'Non spécifié';
      saisonCounts[saison] = (saisonCounts[saison] || 0) + 1;
    });

    // Statistiques par occasion
    const { data: occasionData, error: occasionError } = await supabase
      .from('tenues')
      .select('occasion')
      .eq('user_id', userId)
      .not('occasion', 'is', null);

    if (occasionError) {
      console.error('Error getting occasion stats:', occasionError);
      throw occasionError;
    }

    const occasionCounts: Record<string, number> = {};
    occasionData.forEach(ensemble => {
      const occasion = ensemble.occasion || 'Non spécifié';
      occasionCounts[occasion] = (occasionCounts[occasion] || 0) + 1;
    });

    // Format the results
    return {
      totalCount: totalCount || 0,
      byCategory: [], // This would require more complex queries
      byOccasion: Object.entries(occasionCounts).map(([occasion, count]) => ({
        occasion,
        count
      })),
      bySaison: Object.entries(saisonCounts).map(([saison, count]) => ({
        saison,
        count
      }))
    };
  } catch (error) {
    console.error('Error in getEnsembleStats:', error);
    throw error;
  }
};

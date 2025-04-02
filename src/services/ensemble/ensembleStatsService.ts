
import { supabase } from '@/lib/supabase';

export interface EnsembleStats {
  totalEnsembles: number;
  ensemblesPerSeason: { [key: string]: number };
  mostUsedVetements: { id: number; nom: string; count: number }[];
  recentEnsembles: { id: number; nom: string; date: string }[];
}

export const getEnsembleStats = async (userId: string): Promise<EnsembleStats> => {
  try {
    // Get total ensembles
    const { count: totalEnsembles, error: countError } = await supabase
      .from('tenues')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (countError) {
      console.error('Error counting ensembles:', countError);
      return {
        totalEnsembles: 0,
        ensemblesPerSeason: {},
        mostUsedVetements: [],
        recentEnsembles: []
      };
    }

    // Get ensembles per season
    const { data: seasonData, error: seasonError } = await supabase
      .from('tenues')
      .select('saison')
      .eq('user_id', userId);

    if (seasonError) {
      console.error('Error getting season data:', seasonError);
      return {
        totalEnsembles: totalEnsembles || 0,
        ensemblesPerSeason: {},
        mostUsedVetements: [],
        recentEnsembles: []
      };
    }

    const ensemblesPerSeason: { [key: string]: number } = {};
    seasonData.forEach(ensemble => {
      const season = ensemble.saison || 'Non spécifié';
      ensemblesPerSeason[season] = (ensemblesPerSeason[season] || 0) + 1;
    });

    // Get most used vetements
    const { data: vetementData, error: vetementError } = await supabase
      .from('tenues_vetements')
      .select(`
        vetement_id,
        vetement:vetements (id, nom)
      `)
      .in('tenue_id', supabase.from('tenues').select('id').eq('user_id', userId));

    if (vetementError) {
      console.error('Error getting vetement data:', vetementError);
      return {
        totalEnsembles: totalEnsembles || 0,
        ensemblesPerSeason,
        mostUsedVetements: [],
        recentEnsembles: []
      };
    }

    const vetementCounts: { [key: number]: { id: number; nom: string; count: number } } = {};
    vetementData.forEach(item => {
      if (item.vetement) {
        const id = item.vetement.id;
        if (!vetementCounts[id]) {
          vetementCounts[id] = {
            id,
            nom: item.vetement.nom,
            count: 0
          };
        }
        vetementCounts[id].count++;
      }
    });

    const mostUsedVetements = Object.values(vetementCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Get recent ensembles
    const { data: recentData, error: recentError } = await supabase
      .from('tenues')
      .select('id, nom, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    if (recentError) {
      console.error('Error getting recent ensembles:', recentError);
      return {
        totalEnsembles: totalEnsembles || 0,
        ensemblesPerSeason,
        mostUsedVetements,
        recentEnsembles: []
      };
    }

    const recentEnsembles = recentData.map(ensemble => ({
      id: ensemble.id,
      nom: ensemble.nom,
      date: ensemble.created_at
    }));

    return {
      totalEnsembles: totalEnsembles || 0,
      ensemblesPerSeason,
      mostUsedVetements,
      recentEnsembles
    };
  } catch (error) {
    console.error('Error in getEnsembleStats:', error);
    return {
      totalEnsembles: 0,
      ensemblesPerSeason: {},
      mostUsedVetements: [],
      recentEnsembles: []
    };
  }
};

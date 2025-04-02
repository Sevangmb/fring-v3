
import { supabase } from '@/lib/supabase';

/**
 * Récupère les statistiques sur les ensembles de l'utilisateur
 */
export const getEnsembleStats = async () => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;

    if (!userId) {
      throw new Error("Utilisateur non connecté");
    }

    // Récupérer le nombre total d'ensembles
    const { count: totalEnsembles, error: countError } = await supabase
      .from('tenues')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (countError) {
      console.error("Erreur lors du comptage des ensembles:", countError);
      throw countError;
    }

    // Récupérer les ensembles par saison
    const { data: saisonData, error: saisonError } = await supabase
      .from('tenues')
      .select('saison')
      .eq('user_id', userId)
      .not('saison', 'is', null);

    if (saisonError) {
      console.error("Erreur lors de la récupération des saisons:", saisonError);
      throw saisonError;
    }

    // Comptage par saison
    const saisonStats = saisonData.reduce((acc: Record<string, number>, item) => {
      const saison = item.saison || "Non spécifié";
      acc[saison] = (acc[saison] || 0) + 1;
      return acc;
    }, {});

    // Récupérer les ensembles par occasion
    const { data: occasionData, error: occasionError } = await supabase
      .from('tenues')
      .select('occasion')
      .eq('user_id', userId)
      .not('occasion', 'is', null);

    if (occasionError) {
      console.error("Erreur lors de la récupération des occasions:", occasionError);
      throw occasionError;
    }

    // Comptage par occasion
    const occasionStats = occasionData.reduce((acc: Record<string, number>, item) => {
      const occasion = item.occasion || "Non spécifié";
      acc[occasion] = (acc[occasion] || 0) + 1;
      return acc;
    }, {});

    return {
      totalEnsembles,
      saisonStats,
      occasionStats
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques d'ensembles:", error);
    throw error;
  }
};

/**
 * Récupère les statistiques d'utilisation des vêtements dans les ensembles
 */
export const getVetementsUsageStats = async () => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;

    if (!userId) {
      throw new Error("Utilisateur non connecté");
    }

    // Récupérer le nombre d'utilisations de chaque vêtement dans les ensembles
    const { data, error } = await supabase
      .from('tenues_vetements')
      .select(`
        vetement_id,
        tenue:tenue_id(user_id),
        count
      `)
      .eq('tenue.user_id', userId);

    if (error) {
      console.error("Erreur lors de la récupération des statistiques d'utilisation:", error);
      throw error;
    }

    // Comptage par vêtement
    const vetementsUsage = data.reduce((acc: Record<number, number>, item) => {
      const vetementId = item.vetement_id;
      acc[vetementId] = (acc[vetementId] || 0) + 1;
      return acc;
    }, {});

    return vetementsUsage;
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques d'utilisation:", error);
    throw error;
  }
};


import { supabase } from '@/lib/supabase';
import { Ensemble } from './types';

/**
 * Récupère tous les ensembles créés par l'utilisateur
 */
export const fetchEnsembles = async (): Promise<Ensemble[]> => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;

    if (!userId) {
      throw new Error("Utilisateur non connecté");
    }

    const { data: ensembles, error } = await supabase
      .from('tenues')
      .select(`
        *,
        tenues_vetements:tenues_vetements(
          *,
          vetement:vetement_id(*)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Erreur lors de la récupération des ensembles:", error);
      throw error;
    }

    return ensembles.map(ensemble => ({
      id: ensemble.id,
      nom: ensemble.nom,
      description: ensemble.description,
      occasion: ensemble.occasion,
      saison: ensemble.saison,
      created_at: ensemble.created_at,
      vetements: ensemble.tenues_vetements,
      user_id: ensemble.user_id
    }));
  } catch (error) {
    console.error("Erreur lors de la récupération des ensembles:", error);
    throw error;
  }
};

/**
 * Récupère tous les ensembles créés par les amis de l'utilisateur
 */
export const fetchEnsemblesAmis = async (friendId?: string): Promise<Ensemble[]> => {
  try {
    console.log("Appel à fetchEnsemblesAmis avec friendId:", friendId);
    
    let data;
    let error;
    
    if (friendId && friendId !== "all") {
      console.log("Récupération des ensembles pour un ami spécifique:", friendId);
      const response = await supabase
        .rpc('get_friend_ensembles', { friend_id_param: friendId });
      
      data = response.data;
      error = response.error;
    } else {
      console.log("Récupération des ensembles pour tous les amis");
      const response = await supabase.rpc('get_friends_ensembles');
      
      data = response.data;
      error = response.error;
    }

    if (error) {
      console.error("Erreur lors de la récupération des ensembles des amis:", error);
      throw error;
    }

    if (!data) {
      console.log("Aucun ensemble trouvé pour cet ami / ces amis");
      return [];
    }

    console.log("Données d'ensembles reçues:", data.length);
    
    // Vérifier si les données reçues sont dans le format attendu
    const formattedData = data.map((ensemble: any) => {
      // Normaliser la structure
      return {
        id: ensemble.id,
        nom: ensemble.nom || "Ensemble sans nom",
        description: ensemble.description || "",
        occasion: ensemble.occasion || "",
        saison: ensemble.saison || "",
        created_at: ensemble.created_at,
        user_id: ensemble.user_id,
        vetements: ensemble.vetements || [],
        email: ensemble.email
      };
    });

    return formattedData;
  } catch (error) {
    console.error("Erreur lors de la récupération des ensembles des amis:", error);
    throw error;
  }
};

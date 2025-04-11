
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

    if (!ensembles) {
      return [];
    }

    return ensembles.map(ensemble => ({
      id: ensemble.id,
      nom: ensemble.nom || "Ensemble sans nom",
      description: ensemble.description,
      occasion: ensemble.occasion,
      saison: ensemble.saison,
      created_at: ensemble.created_at,
      vetements: ensemble.tenues_vetements || [],
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
    
    const { data: sessionData } = await supabase.auth.getSession();
    const currentUserId = sessionData.session?.user?.id;
    
    if (!currentUserId) {
      throw new Error("Utilisateur non connecté");
    }
    
    // Si friendId est undefined ou vide, utiliser la fonction qui récupère tous les ensembles d'amis
    if (!friendId || friendId === "all") {
      console.log("Récupération des ensembles pour tous les amis");
      const { data, error } = await supabase.rpc('get_friends_ensembles');

      if (error) {
        console.error("Erreur lors de la récupération des ensembles des amis:", error);
        throw error;
      }

      if (!data || !Array.isArray(data)) {
        console.log("Aucun ensemble trouvé ou format de données inattendu");
        return [];
      }

      console.log("Données d'ensembles reçues:", data.length);
      
      // Normaliser la structure des données
      return formatEnsemblesData(data);
    } else {
      // Sinon utiliser la fonction qui récupère les ensembles d'un ami spécifique
      console.log("Récupération des ensembles pour un ami spécifique:", friendId);
      
      // Vérification pour éviter d'appeler avec son propre ID
      if (friendId === currentUserId) {
        console.log("Tentative de récupérer ses propres ensembles comme si c'était un ami, redirection vers fetchEnsembles");
        return fetchEnsembles();
      }
      
      const { data, error } = await supabase.rpc('get_friend_ensembles', { 
        friend_id_param: friendId 
      });

      if (error) {
        console.error("Erreur lors de la récupération des ensembles d'un ami spécifique:", error);
        throw error;
      }

      if (!data || !Array.isArray(data)) {
        console.log("Aucun ensemble trouvé pour cet ami ou format de données inattendu");
        return [];
      }

      console.log("Données d'ensembles reçues pour ami spécifique:", data.length);
      
      // Normaliser la structure des données 
      return formatEnsemblesData(data);
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des ensembles des amis:", error);
    throw error;
  }
};

// Fonction helper pour formater les données des ensembles
const formatEnsemblesData = (data: any[]): Ensemble[] => {
  return data.map((ensemble: any) => {
    // S'assurer que les vêtements sont un tableau et pas une chaîne JSON
    let vetements = ensemble.vetements;
    if (typeof vetements === 'string') {
      try {
        vetements = JSON.parse(vetements);
      } catch (e) {
        console.error("Erreur lors du parsing des vêtements:", e);
        vetements = [];
      }
    }

    // Si vetements n'est toujours pas un tableau, le convertir en tableau vide
    if (!Array.isArray(vetements)) {
      vetements = [];
    }

    return {
      id: ensemble.id,
      nom: ensemble.nom || "Ensemble sans nom",
      description: ensemble.description || "",
      occasion: ensemble.occasion || "",
      saison: ensemble.saison || "",
      created_at: ensemble.created_at,
      user_id: ensemble.user_id,
      vetements: vetements,
      email: ensemble.email || ""
    };
  });
};

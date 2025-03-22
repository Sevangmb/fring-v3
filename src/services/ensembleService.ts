import { supabase } from '@/lib/supabase';
import { VetementType } from './meteo/tenue';
import { initializeEnsembleData } from './database/ensembleInitialization';
import { Vetement } from './vetement/types';

export interface EnsembleVetement {
  id: number;
  type: VetementType;
}

export interface EnsembleCreateData {
  nom: string;
  description?: string;
  vetements: EnsembleVetement[];
  occasion?: string;
  saison?: string;
}

export interface Ensemble {
  id: number;
  nom: string;
  description?: string;
  occasion?: string;
  saison?: string;
  created_at: string;
  vetements: {
    id: number;
    vetement: Vetement;
    position_ordre: number;
  }[];
}

/**
 * Crée un nouvel ensemble dans la base de données
 */
export const createEnsemble = async (data: EnsembleCreateData) => {
  try {
    await initializeEnsembleData();

    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;

    if (!userId) {
      throw new Error("Utilisateur non connecté");
    }

    const { data: ensembleData, error: ensembleError } = await supabase
      .from('tenues')
      .insert({
        nom: data.nom,
        description: data.description,
        occasion: data.occasion,
        saison: data.saison,
        user_id: userId
      })
      .select()
      .single();

    if (ensembleError) {
      console.error("Erreur lors de la création de l'ensemble:", ensembleError);
      throw ensembleError;
    }

    const ensembleId = ensembleData.id;

    const vetementEntries = data.vetements.map((vetement, index) => ({
      tenue_id: ensembleId,
      vetement_id: vetement.id,
      position_ordre: index
    }));

    const { error: vetementError } = await supabase
      .from('tenues_vetements')
      .insert(vetementEntries);

    if (vetementError) {
      console.error("Erreur lors de l'association des vêtements:", vetementError);
      throw vetementError;
    }

    return ensembleData;
  } catch (error) {
    console.error("Erreur lors de la création de l'ensemble:", error);
    throw error;
  }
};

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
      vetements: ensemble.tenues_vetements
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
    if (friendId && friendId !== "all") {
      // Utilise la fonction get_friend_ensembles pour un ami spécifique
      const { data, error } = await supabase
        .rpc('get_friend_ensembles', { friend_id_param: friendId });

      if (error) {
        console.error("Erreur lors de la récupération des ensembles de l'ami:", error);
        throw error;
      }

      return data || [];
    } else {
      // Utilise la fonction get_friends_ensembles pour tous les amis
      const { data, error } = await supabase.rpc('get_friends_ensembles');

      if (error) {
        console.error("Erreur lors de la récupération des ensembles des amis:", error);
        throw error;
      }

      return data || [];
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des ensembles des amis:", error);
    throw error;
  }
};

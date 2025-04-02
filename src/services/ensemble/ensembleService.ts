import { supabase } from '@/lib/supabase';
import { Ensemble, EnsembleCreateParams, EnsembleUpdateParams } from './types';

/**
 * Récupère un ensemble par son ID
 * @param ensembleId ID de l'ensemble à récupérer
 * @returns L'ensemble trouvé ou null si non trouvé
 */
export const fetchEnsembleById = async (ensembleId: number): Promise<Ensemble | null> => {
  try {
    const { data, error } = await supabase
      .from('tenues')
      .select(`
        id, 
        nom, 
        description, 
        saison, 
        occasion, 
        user_id, 
        created_at, 
        tenues_vetements (
          id, 
          position_ordre,
          vetement:vetement_id (
            id, 
            nom, 
            description, 
            image_url, 
            couleur, 
            marque, 
            categorie_id, 
            saison, 
            temperature_min, 
            temperature_max, 
            taille,
            user_id, 
            created_at, 
            meteorologie
          )
        )
      `)
      .eq('id', ensembleId)
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      return null;
    }

    // Transform data to match Ensemble type
    const ensemble: Ensemble = {
      id: data.id,
      nom: data.nom,
      description: data.description,
      saison: data.saison,
      occasion: data.occasion,
      user_id: data.user_id,
      created_at: data.created_at,
      vetements: data.tenues_vetements.map((tv: any) => ({
        id: tv.id,
        position_ordre: tv.position_ordre,
        vetement: {
          id: tv.vetement.id,
          nom: tv.vetement.nom,
          categorie_id: tv.vetement.categorie_id,
          couleur: tv.vetement.couleur,
          taille: tv.vetement.taille,
          image_url: tv.vetement.image_url,
          description: tv.vetement.description,
          marque: tv.vetement.marque,
          saison: tv.vetement.saison,
          temperature_min: tv.vetement.temperature_min,
          temperature_max: tv.vetement.temperature_max,
          user_id: tv.vetement.user_id,
          created_at: tv.vetement.created_at,
          meteorologie: tv.vetement.meteorologie
        }
      }))
    };

    return ensemble;
  } catch (error) {
    console.error('Error fetching ensemble by ID:', error);
    return null;
  }
};

/**
 * Récupère tous les ensembles de l'utilisateur
 * @returns Liste des ensembles de l'utilisateur
 */
export const fetchEnsembles = async (): Promise<Ensemble[]> => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;
    
    if (!userId) {
      return [];
    }

    const { data, error } = await supabase
      .from('tenues')
      .select(`
        id, 
        nom, 
        description, 
        saison, 
        occasion, 
        user_id, 
        created_at, 
        tenues_vetements (
          id, 
          position_ordre,
          vetement:vetement_id (
            id, 
            nom, 
            description, 
            image_url, 
            couleur, 
            marque, 
            categorie_id, 
            saison, 
            temperature_min, 
            temperature_max, 
            taille,
            user_id, 
            created_at, 
            meteorologie
          )
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    // Transform the data to match the Ensemble type, ensuring correct categories field
    const ensembles: Ensemble[] = data.map(item => ({
      id: item.id,
      nom: item.nom,
      description: item.description,
      saison: item.saison,
      occasion: item.occasion,
      user_id: item.user_id,
      created_at: item.created_at,
      vetements: item.tenues_vetements.map((tv: any) => ({
        id: tv.id,
        position_ordre: tv.position_ordre,
        vetement: {
          id: tv.vetement.id,
          nom: tv.vetement.nom,
          categorie_id: tv.vetement.categorie_id,
          couleur: tv.vetement.couleur,
          taille: tv.vetement.taille,
          image_url: tv.vetement.image_url,
          description: tv.vetement.description,
          marque: tv.vetement.marque,
          saison: tv.vetement.saison,
          temperature_min: tv.vetement.temperature_min,
          temperature_max: tv.vetement.temperature_max,
          user_id: tv.vetement.user_id,
          created_at: tv.vetement.created_at,
          meteorologie: tv.vetement.meteorologie
        }
      }))
    }));

    return ensembles;
  } catch (error) {
    console.error('Error fetching ensembles:', error);
    return [];
  }
};

/**
 * Create a new ensemble
 */
export const createEnsemble = async (ensemble: EnsembleCreateParams): Promise<number | null> => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;

    if (!userId) {
      console.error('User not authenticated');
      return null;
    }

    const { data, error } = await supabase
      .from('tenues')
      .insert([
        {
          nom: ensemble.nom,
          description: ensemble.description,
          saison: ensemble.saison,
          occasion: ensemble.occasion,
          user_id: userId
        }
      ])
      .select('id')
      .single();

    if (error) {
      throw error;
    }

    return data.id;
  } catch (error) {
    console.error('Error creating ensemble:', error);
    return null;
  }
};

/**
 * Update an existing ensemble
 */
export const updateEnsemble = async (ensembleId: number, ensemble: EnsembleUpdateParams): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('tenues')
      .update({
        nom: ensemble.nom,
        description: ensemble.description,
        saison: ensemble.saison,
        occasion: ensemble.occasion
      })
      .eq('id', ensembleId);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error updating ensemble:', error);
    return false;
  }
};


import { supabase } from '@/lib/supabase';
import { Ensemble, EnsembleCreateParams, EnsembleUpdateParams } from './types';

/**
 * Fetch all ensembles for the current user
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

    if (error) throw error;

    return (data || []).map(item => ({
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
  } catch (error) {
    console.error('Error fetching ensembles:', error);
    return [];
  }
};

/**
 * Fetch a specific ensemble by ID
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
      if (error.code === 'PGRST116') {
        return null; // No rows found
      }
      throw error;
    }

    return {
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
  } catch (error) {
    console.error('Error fetching ensemble by ID:', error);
    return null;
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
      throw new Error('User not authenticated');
    }

    // Insert the ensemble
    const { data: ensembleData, error: ensembleError } = await supabase
      .from('tenues')
      .insert({
        nom: ensemble.nom,
        description: ensemble.description,
        occasion: ensemble.occasion,
        saison: ensemble.saison,
        user_id: userId
      })
      .select('id')
      .single();

    if (ensembleError) throw ensembleError;

    const ensembleId = ensembleData.id;

    // Insert ensemble-vetement associations with position order
    const vetementsToInsert = ensemble.vetements.map((v, index) => ({
      tenue_id: ensembleId,
      vetement_id: v.id,
      position_ordre: index + 1
    }));

    const { error: vetementsError } = await supabase
      .from('tenues_vetements')
      .insert(vetementsToInsert);

    if (vetementsError) throw vetementsError;

    return ensembleId;
  } catch (error) {
    console.error('Error creating ensemble:', error);
    return null;
  }
};

/**
 * Update an existing ensemble
 */
export const updateEnsemble = async (ensemble: EnsembleUpdateParams): Promise<boolean> => {
  try {
    // Update ensemble basic info
    const { error: ensembleError } = await supabase
      .from('tenues')
      .update({
        nom: ensemble.nom,
        description: ensemble.description,
        occasion: ensemble.occasion,
        saison: ensemble.saison
      })
      .eq('id', ensemble.id);

    if (ensembleError) throw ensembleError;

    // Delete existing vetement associations
    const { error: deleteError } = await supabase
      .from('tenues_vetements')
      .delete()
      .eq('tenue_id', ensemble.id);

    if (deleteError) throw deleteError;

    // Insert new vetement associations with position order
    const vetementsToInsert = ensemble.vetements.map((v, index) => ({
      tenue_id: ensemble.id,
      vetement_id: v.id,
      position_ordre: index + 1
    }));

    const { error: vetementsError } = await supabase
      .from('tenues_vetements')
      .insert(vetementsToInsert);

    if (vetementsError) throw vetementsError;

    return true;
  } catch (error) {
    console.error('Error updating ensemble:', error);
    return false;
  }
};

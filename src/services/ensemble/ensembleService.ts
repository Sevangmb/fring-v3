
import { supabase } from '@/lib/supabase';
import { Ensemble, EnsembleCreateParams, EnsembleUpdateParams } from './types';
import { Vetement } from '@/services/vetement/types';

export const fetchEnsembles = async (userId?: string): Promise<Ensemble[]> => {
  try {
    // If userId not provided, get it from the current session
    if (!userId) {
      const { data } = await supabase.auth.getUser();
      userId = data.user?.id;
      
      if (!userId) {
        return [];
      }
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
          vetement_id,
          position_ordre,
          vetement:vetements (
            id,
            nom,
            description,
            image_url,
            couleur,
            marque,
            categorie,
            saison,
            temperature_min,
            temperature_max,
            user_id,
            created_at,
            meteorologie
          )
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching ensembles:', error);
      return [];
    }

    // Transform the data to match the Ensemble interface
    return data.map(item => ({
      id: item.id,
      nom: item.nom,
      description: item.description,
      saison: item.saison,
      occasion: item.occasion,
      user_id: item.user_id,
      created_at: item.created_at,
      vetements: item.tenues_vetements.map(tv => {
        // Ensure vetement is properly handled (could be an array or object)
        const vetementData = Array.isArray(tv.vetement) ? tv.vetement[0] : tv.vetement;
        
        // Create a proper Vetement object
        const vetement: Vetement = {
          id: vetementData.id,
          nom: vetementData.nom,
          description: vetementData.description || '',
          image_url: vetementData.image_url,
          couleur: vetementData.couleur,
          marque: vetementData.marque || '',
          categorie_id: 0, // Default value
          categorie: vetementData.categorie,
          taille: '',  // Default value
          saison: vetementData.saison,
          temperature_min: vetementData.temperature_min,
          temperature_max: vetementData.temperature_max,
          user_id: vetementData.user_id,
          created_at: vetementData.created_at,
          meteorologie: vetementData.meteorologie
        };
        
        return {
          id: tv.vetement_id,
          vetement: vetement,
          position_ordre: tv.position_ordre
        };
      })
    }));
  } catch (error) {
    console.error('Error in fetchEnsembles:', error);
    return [];
  }
};

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
          vetement_id,
          position_ordre,
          vetement:vetements (
            id,
            nom,
            description,
            image_url,
            couleur,
            marque,
            categorie,
            saison,
            temperature_min,
            temperature_max,
            user_id,
            created_at,
            meteorologie
          )
        )
      `)
      .eq('id', ensembleId)
      .single();

    if (error) {
      console.error('Error fetching ensemble by ID:', error);
      return null;
    }

    return {
      id: data.id,
      nom: data.nom,
      description: data.description,
      saison: data.saison,
      occasion: data.occasion,
      user_id: data.user_id,
      created_at: data.created_at,
      vetements: data.tenues_vetements.map(tv => {
        // Ensure vetement is properly handled (could be an array or object)
        const vetementData = Array.isArray(tv.vetement) ? tv.vetement[0] : tv.vetement;
        
        // Create a proper Vetement object
        const vetement: Vetement = {
          id: vetementData.id,
          nom: vetementData.nom,
          description: vetementData.description || '',
          image_url: vetementData.image_url,
          couleur: vetementData.couleur,
          marque: vetementData.marque || '',
          categorie_id: 0, // Default value
          categorie: vetementData.categorie,
          taille: '',  // Default value
          saison: vetementData.saison,
          temperature_min: vetementData.temperature_min,
          temperature_max: vetementData.temperature_max,
          user_id: vetementData.user_id,
          created_at: vetementData.created_at,
          meteorologie: vetementData.meteorologie
        };
        
        return {
          id: tv.vetement_id,
          vetement: vetement,
          position_ordre: tv.position_ordre
        };
      }),
    };
  } catch (error) {
    console.error('Error in fetchEnsembleById:', error);
    return null;
  }
};

export const createEnsemble = async (ensembleData: EnsembleCreateParams, userId?: string): Promise<Ensemble | null> => {
  try {
    // If userId not provided, get it from the current session
    if (!userId) {
      const { data } = await supabase.auth.getUser();
      userId = data.user?.id;
      
      if (!userId) {
        throw new Error('User not authenticated');
      }
    }
    
    // Create the ensemble
    const { data: ensemble, error: ensembleError } = await supabase
      .from('tenues')
      .insert({
        nom: ensembleData.nom,
        description: ensembleData.description,
        saison: ensembleData.saison,
        occasion: ensembleData.occasion,
        user_id: userId,
      })
      .select()
      .single();

    if (ensembleError) {
      console.error('Error creating ensemble:', ensembleError);
      return null;
    }

    // Add vetements to the ensemble
    const tenues_vetements = ensembleData.vetements.map((v, index) => ({
      tenue_id: ensemble.id,
      vetement_id: v.id,
      position_ordre: index + 1,
    }));

    const { error: vetementsError } = await supabase
      .from('tenues_vetements')
      .insert(tenues_vetements);

    if (vetementsError) {
      console.error('Error adding vetements to ensemble:', vetementsError);
      // Clean up the created ensemble
      await supabase.from('tenues').delete().eq('id', ensemble.id);
      return null;
    }

    // Return the created ensemble with vetements
    return fetchEnsembleById(ensemble.id);
  } catch (error) {
    console.error('Error in createEnsemble:', error);
    return null;
  }
};

export const updateEnsemble = async (ensembleData: EnsembleUpdateParams): Promise<Ensemble | null> => {
  try {
    // Update the ensemble
    const { error: ensembleError } = await supabase
      .from('tenues')
      .update({
        nom: ensembleData.nom,
        description: ensembleData.description,
        saison: ensembleData.saison,
        occasion: ensembleData.occasion,
      })
      .eq('id', ensembleData.id);

    if (ensembleError) {
      console.error('Error updating ensemble:', ensembleError);
      return null;
    }

    // Delete existing vetements
    const { error: deleteError } = await supabase
      .from('tenues_vetements')
      .delete()
      .eq('tenue_id', ensembleData.id);

    if (deleteError) {
      console.error('Error deleting existing vetements:', deleteError);
      return null;
    }

    // Add new vetements
    const tenues_vetements = ensembleData.vetements.map((v, index) => ({
      tenue_id: ensembleData.id,
      vetement_id: v.id,
      position_ordre: index + 1,
    }));

    const { error: vetementsError } = await supabase
      .from('tenues_vetements')
      .insert(tenues_vetements);

    if (vetementsError) {
      console.error('Error adding vetements to ensemble:', vetementsError);
      return null;
    }

    // Return the updated ensemble
    return fetchEnsembleById(ensembleData.id);
  } catch (error) {
    console.error('Error in updateEnsemble:', error);
    return null;
  }
};

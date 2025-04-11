
import { supabase } from '@/lib/supabase';
import { Ensemble } from './types';

/**
 * Récupère un ensemble par son ID
 * @param ensembleId ID de l'ensemble à récupérer
 * @returns L'ensemble avec ses vêtements, ou null si non trouvé
 */
export const fetchEnsembleById = async (ensembleId: number): Promise<Ensemble | null> => {
  try {
    console.log(`Fetching ensemble with ID: ${ensembleId}`);
    const { data: ensemble, error } = await supabase
      .from('tenues')
      .select(`
        id,
        nom,
        description,
        occasion,
        saison,
        created_at,
        user_id,
        tenues_vetements:tenues_vetements(
          id,
          vetement:vetement_id(
            id,
            nom,
            description,
            image_url,
            couleur,
            marque,
            taille,
            categorie_id
          )
        ),
        users:user_id(email)
      `)
      .eq('id', ensembleId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching ensemble by ID:", error);
      throw error;
    }

    if (!ensemble) {
      console.log(`No ensemble found with ID: ${ensembleId}`);
      return null;
    }

    // Get the email from the users field
    // The users field is returned directly as an object with email property
    // instead of an array when using the user_id foreign key in the select
    const userEmail = ensemble.users?.email || undefined;

    // Format the result to match the Ensemble type
    return {
      id: ensemble.id,
      nom: ensemble.nom || "Ensemble sans nom",
      description: ensemble.description,
      occasion: ensemble.occasion,
      saison: ensemble.saison,
      created_at: ensemble.created_at,
      user_id: ensemble.user_id,
      vetements: ensemble.tenues_vetements || [],
      email: userEmail
    };
  } catch (error) {
    console.error("Error fetching ensemble by ID:", error);
    throw error;
  }
};

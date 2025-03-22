
import { supabase } from '@/lib/supabase';
import { EnsembleCreateData } from './types';
import { initializeEnsembleData } from '../database/ensembleInitialization';

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

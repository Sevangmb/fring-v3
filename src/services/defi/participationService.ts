
import { supabase } from '@/lib/supabase';
import { Ensemble } from '../ensemble/types';

export interface DefiParticipation {
  id: number;
  defi_id: number;
  user_id: string;
  ensemble_id: number;
  commentaire?: string;
  created_at: string;
  user_email?: string;
  tenue: {
    id: number;
    nom: string;
    description?: string;
    occasion?: string;
    saison?: string;
    created_at: string;
    user_id: string;
    vetements: {
      id: number;
      vetement: any;
    }[];
  };
}

/**
 * Récupérer toutes les participations à un défi
 */
export const getDefiParticipations = async (defiId: number): Promise<DefiParticipation[]> => {
  try {
    // Récupérer les participations avec les informations utilisateur
    const { data: participationsWithUser, error: participationsWithUserError } = await supabase
      .from('defis_participations')
      .select(`
        id,
        defi_id,
        user_id,
        ensemble_id,
        commentaire,
        created_at,
        user:user_id (
          email
        )
      `)
      .eq('defi_id', defiId)
      .order('created_at', { ascending: false });

    if (participationsWithUserError) {
      console.error("Erreur lors de la récupération des participations:", participationsWithUserError);
      throw participationsWithUserError;
    }

    // Enrichir les données avec l'email de l'utilisateur
    const participationsWithEmail = participationsWithUser.map(participation => ({
      ...participation,
      user_email: participation.user?.email
    }));

    // Récupérer les informations des ensembles pour chaque participation
    const enrichedParticipations = await Promise.all(
      participationsWithEmail.map(async (participation) => {
        try {
          const { data: tenues, error: tenuesError } = await supabase
            .from('tenues')
            .select(`
              id,
              nom,
              description,
              occasion,
              saison,
              created_at,
              user_id,
              vetements:tenues_vetements(
                id,
                vetement:vetement_id(*)
              )
            `)
            .eq('id', participation.ensemble_id);

          if (tenuesError) {
            console.error("Erreur lors de la récupération des tenues:", tenuesError);
            return participation;
          }

          return {
            ...participation,
            tenue: tenues[0] || null
          };
        } catch (error) {
          console.error("Erreur lors de l'enrichissement des participations:", error);
          return participation;
        }
      })
    );

    return enrichedParticipations;
  } catch (error) {
    console.error("Erreur lors de la récupération des participations:", error);
    return [];
  }
};

/**
 * Participer à un défi avec un ensemble existant
 */
export const participerDefi = async (
  defiId: number, 
  ensembleId: number, 
  commentaire?: string
): Promise<boolean> => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;

    if (!userId) {
      throw new Error("Utilisateur non connecté");
    }

    // Vérifier si l'utilisateur a déjà participé à ce défi
    const { data: existingParticipation, error: checkError } = await supabase
      .from('defis_participations')
      .select('id')
      .eq('defi_id', defiId)
      .eq('user_id', userId);

    if (checkError) {
      console.error("Erreur lors de la vérification de participation:", checkError);
      throw checkError;
    }

    if (existingParticipation && existingParticipation.length > 0) {
      // Mettre à jour la participation existante
      const { error: updateError } = await supabase
        .from('defis_participations')
        .update({
          ensemble_id: ensembleId,
          commentaire: commentaire || null
        })
        .eq('id', existingParticipation[0].id);

      if (updateError) {
        console.error("Erreur lors de la mise à jour de la participation:", updateError);
        throw updateError;
      }
    } else {
      // Créer une nouvelle participation
      const { error: insertError } = await supabase
        .from('defis_participations')
        .insert({
          defi_id: defiId,
          user_id: userId,
          ensemble_id: ensembleId,
          commentaire: commentaire || null
        });

      if (insertError) {
        console.error("Erreur lors de la création de la participation:", insertError);
        throw insertError;
      }
    }

    return true;
  } catch (error) {
    console.error("Erreur lors de la participation au défi:", error);
    return false;
  }
};

/**
 * Vérifier si un utilisateur participe à un défi
 */
export const checkUserParticipation = async (defiId: number): Promise<{
  participe: boolean;
  ensembleId?: number;
}> => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;

    if (!userId) {
      return { participe: false };
    }

    const { data, error } = await supabase
      .from('defis_participations')
      .select('ensemble_id')
      .eq('defi_id', defiId)
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // L'utilisateur ne participe pas à ce défi
        return { participe: false };
      }
      console.error("Erreur lors de la vérification de participation:", error);
      throw error;
    }

    return {
      participe: true,
      ensembleId: data.ensemble_id
    };
  } catch (error) {
    console.error("Erreur lors de la vérification de participation:", error);
    return { participe: false };
  }
};

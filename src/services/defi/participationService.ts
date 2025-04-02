
import { supabase } from '@/lib/supabase';

export interface DefiParticipation {
  id: number;
  defi_id: number;
  user_id: string;
  ensemble_id: number;
  created_at: string;
  commentaire?: string;
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
 * Récupérer les participations pour un défi spécifique
 */
export const getDefiParticipations = async (defiId: number): Promise<DefiParticipation[]> => {
  try {
    const { data, error } = await supabase
      .from('defi_participations')
      .select(`
        id, 
        defi_id, 
        user_id, 
        ensemble_id, 
        commentaire, 
        created_at,
        user:user_id(email)
      `)
      .eq('defi_id', defiId);

    if (error) throw error;

    // Récupérer les détails des ensembles pour chaque participation
    const enrichedData = await Promise.all(
      data.map(async (participation) => {
        // Récupérer les informations de l'ensemble
        const { data: ensembleData, error: ensembleError } = await supabase
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
          .eq('id', participation.ensemble_id)
          .single();

        if (ensembleError) {
          console.error("Erreur lors de la récupération de l'ensemble:", ensembleError);
          return {
            ...participation,
            user_email: participation.user && participation.user.length > 0 ? participation.user[0].email : null,
            tenue: {
              id: 0,
              nom: "Ensemble introuvable",
              created_at: "",
              user_id: "",
              vetements: []
            }
          };
        }

        return {
          ...participation,
          user_email: participation.user && participation.user.email,
          tenue: ensembleData
        };
      })
    );

    return enrichedData as DefiParticipation[];
  } catch (error) {
    console.error("Erreur lors de la récupération des participations:", error);
    throw error;
  }
};

/**
 * Participer à un défi en soumettant un ensemble
 */
export const participerDefi = async (defiId: number, ensembleId: number, commentaire?: string): Promise<boolean> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("Utilisateur non connecté");

    const { error } = await supabase
      .from('defi_participations')
      .insert({
        defi_id: defiId,
        user_id: session.user.id,
        ensemble_id: ensembleId,
        commentaire
      });

    if (error) throw error;

    // Mettre à jour le compteur de participants du défi
    const { error: updateError } = await supabase
      .from('defis')
      .update({ participants_count: supabase.rpc('increment', { inc: 1 }) })
      .eq('id', defiId);

    if (updateError) {
      console.error("Erreur lors de la mise à jour du compteur:", updateError);
    }

    return true;
  } catch (error) {
    console.error("Erreur lors de la participation au défi:", error);
    return false;
  }
};

/**
 * Vérifier si un utilisateur a déjà participé à un défi
 */
export const hasUserParticipated = async (defiId: number): Promise<boolean> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return false;

    const { data, error } = await supabase
      .from('defi_participations')
      .select('id')
      .eq('defi_id', defiId)
      .eq('user_id', session.user.id)
      .maybeSingle();

    if (error) throw error;

    return !!data;
  } catch (error) {
    console.error("Erreur lors de la vérification de participation:", error);
    return false;
  }
};

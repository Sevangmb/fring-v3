
import { supabase } from '@/lib/supabase';

export interface DefiParticipation {
  id: number;
  defi_id: number;
  user_id: string;
  ensemble_id: number;
  created_at: string;
  commentaire?: string;
  tenue?: {
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
  user_email?: string;
}

/**
 * Récupère toutes les participations pour un défi donné
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
        tenue:ensemble_id(
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
        )
      `)
      .eq('defi_id', defiId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Récupérer les emails des utilisateurs pour chaque participation
    if (data && data.length > 0) {
      const participationsWithEmail = await Promise.all(
        data.map(async (participation) => {
          const { data: userData, error: userError } = await supabase
            .from('profiles')
            .select('email')
            .eq('id', participation.user_id)
            .maybeSingle();
          
          if (userError) console.error("Erreur lors de la récupération de l'email:", userError);
          
          return {
            ...participation,
            user_email: userData?.email || undefined
          };
        })
      );
      
      return participationsWithEmail;
    }
    
    return data || [];
  } catch (error) {
    console.error("Erreur lors de la récupération des participations:", error);
    return [];
  }
};

/**
 * Créer une nouvelle participation à un défi
 */
export const createDefiParticipation = async (
  defiId: number,
  ensembleId: number,
  commentaire?: string
): Promise<boolean> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) throw new Error("Utilisateur non authentifié");
    
    const { error } = await supabase
      .from('defi_participations')
      .insert({
        defi_id: defiId,
        user_id: session.user.id,
        ensemble_id: ensembleId,
        commentaire: commentaire
      });
    
    if (error) throw error;
    
    // Mettre à jour le compteur de participants du défi
    await supabase
      .from('defis')
      .update({ participants_count: supabase.rpc('increment', { row_id: defiId, table_name: 'defis', column_name: 'participants_count' }) })
      .eq('id', defiId);
    
    return true;
  } catch (error) {
    console.error("Erreur lors de la création de la participation:", error);
    return false;
  }
};

/**
 * Vérifie si un utilisateur a déjà participé à un défi
 */
export const checkUserParticipation = async (defiId: number): Promise<{
  participe: boolean;
  ensembleId?: number;
}> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return { participe: false };
    
    const { data, error } = await supabase
      .from('defi_participations')
      .select('ensemble_id')
      .eq('defi_id', defiId)
      .eq('user_id', session.user.id)
      .maybeSingle();
    
    if (error) throw error;
    
    return {
      participe: !!data,
      ensembleId: data?.ensemble_id
    };
  } catch (error) {
    console.error("Erreur lors de la vérification de la participation:", error);
    return { participe: false };
  }
};

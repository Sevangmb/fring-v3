
import { supabase } from '@/lib/supabase';
import { Ensemble } from './types';

/**
 * Récupère les ensembles d'un utilisateur spécifique
 * @param userId ID de l'utilisateur (optionnel, utilise l'utilisateur courant si non fourni)
 * @returns Liste des ensembles de l'utilisateur
 */
export const fetchUserEnsembles = async (userId?: string): Promise<Ensemble[]> => {
  try {
    // If userId is not provided, get the current user's ID
    if (!userId) {
      const { data: sessionData } = await supabase.auth.getSession();
      userId = sessionData.session?.user?.id;
      
      if (!userId) {
        console.warn("fetchUserEnsembles: Aucun utilisateur connecté");
        return [];
      }
    }

    console.log("fetchUserEnsembles: Récupération des ensembles pour l'utilisateur", userId);

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
      console.error("fetchUserEnsembles: Erreur lors de la requête", error);
      throw error;
    }

    console.log("fetchUserEnsembles: Ensembles récupérés", data?.length || 0);

    // Transform the data to match the Ensemble type
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
    console.error('Error fetching user ensembles:', error);
    return [];
  }
};

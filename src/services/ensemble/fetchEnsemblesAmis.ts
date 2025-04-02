
import { supabase } from '@/lib/supabase';
import { Ensemble } from './types';
import { Vetement } from '@/services/vetement/types';

/**
 * Récupère les ensembles des amis d'un utilisateur
 * @param userId ID de l'utilisateur (optionnel)
 * @returns Liste des ensembles des amis
 */
export const fetchEnsemblesAmis = async (userId?: string): Promise<Ensemble[]> => {
  try {
    // Si l'ID de l'utilisateur n'est pas fourni, on utilise l'utilisateur connecté
    if (!userId) {
      const { data: sessionData } = await supabase.auth.getSession();
      userId = sessionData.session?.user?.id;
      
      if (!userId) {
        throw new Error("Utilisateur non connecté");
      }
    }

    // Récupérer les amis de l'utilisateur
    const { data: amisData, error: amisError } = await supabase
      .from('amis')
      .select('ami_id')
      .eq('user_id', userId)
      .eq('statut', 'accepte');

    if (amisError) {
      console.error("Erreur lors de la récupération des amis:", amisError);
      return [];
    }

    if (!amisData || amisData.length === 0) {
      return [];
    }

    // Construire un tableau des IDs des amis
    const amisIds = amisData.map(ami => ami.ami_id);

    // Récupérer les ensembles des amis
    const { data: ensemblesData, error: ensemblesError } = await supabase
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
        ),
        users (
          email
        )
      `)
      .in('user_id', amisIds);

    if (ensemblesError) {
      console.error("Erreur lors de la récupération des ensembles des amis:", ensemblesError);
      return [];
    }

    // Transformer les données pour correspondre au type Ensemble
    const ensembles: Ensemble[] = ensemblesData.map(ensemble => {
      // Extract email safely
      let email = '';
      if (ensemble.users && Array.isArray(ensemble.users) && ensemble.users.length > 0) {
        email = ensemble.users[0].email || '';
      }

      return {
        id: ensemble.id,
        nom: ensemble.nom,
        description: ensemble.description,
        saison: ensemble.saison,
        occasion: ensemble.occasion,
        user_id: ensemble.user_id,
        created_at: ensemble.created_at,
        email,
        vetements: ensemble.tenues_vetements.map(item => {
          const vetementData = Array.isArray(item.vetement) ? item.vetement[0] : item.vetement;
          
          // Create a proper Vetement object that matches the type
          const vetement: Vetement = {
            id: vetementData.id,
            nom: vetementData.nom,
            description: vetementData.description,
            image_url: vetementData.image_url,
            couleur: vetementData.couleur,
            marque: vetementData.marque,
            categorie_id: 0, // Default value
            categorie: vetementData.categorie,
            taille: '', // Default value
            saison: vetementData.saison,
            temperature_min: vetementData.temperature_min,
            temperature_max: vetementData.temperature_max,
            user_id: vetementData.user_id,
            created_at: vetementData.created_at,
            meteorologie: vetementData.meteorologie
          };
          
          return {
            id: item.id,
            vetement: vetement,
            position_ordre: item.position_ordre
          };
        })
      };
    });

    return ensembles;
  } catch (error) {
    console.error("Erreur lors de la récupération des ensembles des amis:", error);
    return [];
  }
};

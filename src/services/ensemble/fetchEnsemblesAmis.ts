
import { supabase } from '@/lib/supabase';
import { Ensemble } from './types';

/**
 * Récupère les ensembles des amis d'un utilisateur
 * @returns Liste des ensembles des amis
 */
export const fetchEnsemblesAmis = async (): Promise<Ensemble[]> => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;
    
    if (!userId) {
      return [];
    }

    // Récupérer les IDs des amis de l'utilisateur (relations acceptées)
    const { data: amisData, error: amisError } = await supabase
      .from('amis')
      .select('ami_id')
      .eq('user_id', userId)
      .eq('statut', 'accepté');

    if (amisError) {
      throw amisError;
    }

    if (!amisData || amisData.length === 0) {
      return [];
    }

    // Extraire les IDs des amis
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
        profiles:user_id(email),
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
      .in('user_id', amisIds)
      .order('created_at', { ascending: false });

    if (ensemblesError) {
      throw ensemblesError;
    }

    // Transformer les données dans le format attendu
    const ensemblesAmis: Ensemble[] = ensemblesData.map(item => ({
      id: item.id,
      nom: item.nom,
      description: item.description,
      saison: item.saison,
      occasion: item.occasion,
      user_id: item.user_id,
      created_at: item.created_at,
      user_email: item.profiles?.email,
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

    return ensemblesAmis;
  } catch (error) {
    console.error('Error fetching friends ensembles:', error);
    return [];
  }
};

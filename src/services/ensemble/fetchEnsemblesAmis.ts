
import { supabase } from '@/lib/supabase';
import { Ensemble } from './types';

export const fetchEnsemblesAmis = async (userId: string): Promise<Ensemble[]> => {
  try {
    // Get friends IDs
    const { data: amis, error: amisError } = await supabase
      .from('amis')
      .select('ami_id, status')
      .eq('user_id', userId)
      .eq('status', 'accepted');

    if (amisError) {
      console.error('Error fetching friends:', amisError);
      return [];
    }

    const amiIds = amis.map(ami => ami.ami_id);

    if (amiIds.length === 0) {
      return [];
    }

    // Get ensembles from friends
    const { data: ensembles, error: ensemblesError } = await supabase
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
        user:user_id (
          email
        )
      `)
      .in('user_id', amiIds)
      .order('created_at', { ascending: false });

    if (ensemblesError) {
      console.error('Error fetching friends ensembles:', ensemblesError);
      return [];
    }

    // Transform the data to match the Ensemble interface
    return ensembles.map(item => {
      // Extract email correctly
      const email = item.user?.email || undefined;
      
      return {
        id: item.id,
        nom: item.nom,
        description: item.description,
        saison: item.saison,
        occasion: item.occasion,
        user_id: item.user_id,
        created_at: item.created_at,
        email: email,
        vetements: item.tenues_vetements.map(tv => ({
          id: tv.vetement_id,
          vetement: tv.vetement,
          position_ordre: tv.position_ordre,
        })),
      };
    });
  } catch (error) {
    console.error('Error in fetchEnsemblesAmis:', error);
    return [];
  }
};

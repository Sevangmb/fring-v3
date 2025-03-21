
import { supabase } from '@/lib/supabase';
import { Ami } from './types';
import { enrichirAmisAvecEmails } from './enrichirAmis';

// Function to fetch friends list
export const fetchAmis = async (): Promise<Ami[]> => {
  try {
    // Get the connected user's ID
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;

    if (!userId) {
      console.error('Aucun utilisateur connecté pour récupérer les amis');
      return [];
    }

    console.log('Récupération des amis pour l\'utilisateur:', userId);

    // Get friends (where the user is either initiator or recipient)
    const { data, error } = await supabase
      .from('amis')
      .select('*')
      .or(`user_id.eq.${userId},ami_id.eq.${userId}`)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Erreur lors de la récupération des amis:', error);
      throw new Error(`Erreur de récupération des amis: ${error.message}`);
    }

    console.log('Amis récupérés:', data);
    
    return data as Ami[];
  } catch (error) {
    console.error('Erreur lors de la récupération des amis:', error);
    throw error;
  }
};

// Export the main function with emails enrichment
export const fetchAmisWithEmails = async (): Promise<Ami[]> => {
  const listeAmis = await fetchAmis();
  return enrichirAmisAvecEmails(listeAmis);
};


import { supabase } from '@/lib/supabase';
import { Ami } from './types';

// Function to accept a friend request
export const accepterDemandeAmi = async (amiId: number): Promise<Ami | null> => {
  try {
    // Get the connected user's ID
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;

    if (!userId) {
      throw new Error('Vous devez être connecté pour accepter une demande d\'ami');
    }

    console.log('Acceptation de la demande d\'ami:', amiId);

    // Méthode directe: mettre à jour directement la table amis
    const { data, error } = await supabase
      .from('amis')
      .update({ status: 'accepted' })
      .eq('id', amiId)
      .select('*')
      .single();
    
    if (error) {
      console.error('Erreur lors de l\'acceptation de la demande d\'ami:', error);
      throw new Error(`Impossible d'accepter la demande: ${error.message}`);
    }
    
    console.log('Demande acceptée avec succès:', data);
    return data as Ami;
  } catch (error) {
    console.error('Erreur lors de l\'acceptation de la demande d\'ami:', error);
    throw error;
  }
};

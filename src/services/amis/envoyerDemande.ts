
import { supabase } from '@/lib/supabase';
import { Ami } from './types';

// Function to send a friend request
export const envoyerDemandeAmi = async (amiId: string): Promise<Ami> => {
  try {
    // Get the connected user's ID
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;

    if (!userId) {
      throw new Error('Vous devez être connecté pour envoyer une demande d\'ami');
    }

    // Check if the friend ID is valid
    if (!amiId) {
      throw new Error('ID d\'ami invalide');
    }

    console.log('Envoi d\'une demande d\'ami à:', amiId);

    // Check if a request already exists
    const { data: existingRequest, error: checkError } = await supabase
      .from('amis')
      .select('*')
      .or(`and(user_id.eq.${userId},ami_id.eq.${amiId}),and(user_id.eq.${amiId},ami_id.eq.${userId})`)
      .maybeSingle();
    
    if (checkError) {
      console.error('Erreur lors de la vérification de la demande d\'ami:', checkError);
      throw new Error(`Erreur de vérification: ${checkError.message}`);
    }
    
    if (existingRequest) {
      throw new Error('Une demande d\'ami existe déjà avec cet utilisateur');
    }

    // Insert the new friend request
    const { data, error } = await supabase
      .from('amis')
      .insert([
        {
          user_id: userId,
          ami_id: amiId,
          status: 'pending'
        }
      ])
      .select()
      .single();
    
    if (error) {
      console.error('Erreur lors de l\'envoi de la demande d\'ami:', error);
      throw new Error(`Erreur d'envoi: ${error.message}`);
    }
    
    return data as Ami;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la demande d\'ami:', error);
    throw error;
  }
};

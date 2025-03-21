
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

    // Use the simple RPC function to update the status
    const { data, error } = await supabase
      .rpc('accepter_ami_simple', { 
        ami_id_param: amiId 
      });
    
    if (error) {
      console.error('Erreur lors de l\'acceptation de la demande d\'ami avec RPC:', error);
      
      // Fallback: use a direct method if the RPC fails
      try {
        console.log('Utilisation de la méthode de secours pour accepter la demande');
        const { data: directData, error: directError } = await supabase
          .from('amis')
          .update({ status: 'accepted' })
          .eq('id', amiId)
          .select()
          .single();
        
        if (directError) {
          console.error('Échec de la méthode de secours pour accepter la demande:', directError);
          throw directError;
        }
        
        console.log('Demande acceptée avec méthode de secours:', directData);
        return directData as Ami;
      } catch (fallbackError) {
        console.error('Échec de la méthode de secours:', fallbackError);
        throw new Error(`Impossible d'accepter la demande: ${error.message}`);
      }
    }
    
    if (data === true) {
      // The RPC was successful, get the updated request
      const { data: amiData, error: fetchError } = await supabase
        .from('amis')
        .select('*')
        .eq('id', amiId)
        .single();
      
      if (fetchError) {
        console.error('Erreur lors de la récupération de la demande mise à jour:', fetchError);
        throw new Error(`Erreur après acceptation: ${fetchError.message}`);
      }
      
      console.log('Demande acceptée et récupérée avec succès:', amiData);
      return amiData as Ami;
    }
    
    console.log('La fonction RPC a échoué sans erreur spécifique');
    return null;
  } catch (error) {
    console.error('Erreur lors de l\'acceptation de la demande d\'ami:', error);
    throw error;
  }
};

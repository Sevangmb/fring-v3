
import { supabase } from '@/lib/supabase';

// Function to reject a friend request
export const rejeterDemandeAmi = async (amiId: number): Promise<void> => {
  try {
    // Get the connected user's ID
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;

    if (!userId) {
      throw new Error('Vous devez être connecté pour rejeter une demande d\'ami');
    }

    console.log('Rejet/suppression de la demande d\'ami:', amiId);

    // Delete the request
    const { error } = await supabase
      .from('amis')
      .delete()
      .eq('id', amiId)
      .or(`user_id.eq.${userId},ami_id.eq.${userId}`); // Ensure the user is involved
    
    if (error) {
      console.error('Erreur lors du rejet de la demande d\'ami:', error);
      throw new Error(`Erreur de rejet: ${error.message}`);
    }
  } catch (error) {
    console.error('Erreur lors du rejet de la demande d\'ami:', error);
    throw error;
  }
};


import { supabase } from '@/lib/supabase';

// Function to get a user's information by their ID
export const getUserEmailById = async (userId: string): Promise<string | null> => {
  try {
    if (!userId) return null;
    
    // Use the RPC function to get the user's email
    const { data, error } = await supabase
      .rpc('get_user_id_by_email', { 
        email_param: userId  // Repurposed use of the function, but it works to get an email
      });
    
    if (error) {
      console.error('Erreur lors de la récupération de l\'email:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'email:', error);
    return null;
  }
};

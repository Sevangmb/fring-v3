import { supabase } from '@/lib/supabase';
import { Ami } from './types';
import { searchUsersByEmail } from '@/services/user';

// Function to enrich friend data with user emails
export const enrichirAmisAvecEmails = async (amis: Ami[]): Promise<Ami[]> => {
  try {
    // Get the connected user's ID
    const { data: sessionData } = await supabase.auth.getSession();
    const currentUserId = sessionData.session?.user?.id;
    
    if (!currentUserId || amis.length === 0) return amis;
    
    // Utiliser une fonction RPC sécurisée pour récupérer les emails
    const { data, error } = await supabase.rpc('get_users_by_ids', {
      user_ids: amis.map(ami => 
        ami.user_id === currentUserId ? ami.ami_id : ami.user_id
      )
    });
    
    if (error) {
      console.error('Erreur lors de la récupération des données utilisateurs:', error);
      return amis;
    }
    
    // Create an email dictionary by ID
    const emailsById = (data || []).reduce((acc, user) => {
      acc[user.id] = user.email;
      return acc;
    }, {} as Record<string, string>);
    
    // Enrich friend data
    return amis.map(ami => {
      const targetId = ami.user_id === currentUserId ? ami.ami_id : ami.user_id;
      return {
        ...ami,
        email: emailsById[targetId] || 'Utilisateur inconnu'
      };
    });
  } catch (error) {
    console.error('Erreur lors de l\'enrichissement des amis:', error);
    return amis;
  }
};

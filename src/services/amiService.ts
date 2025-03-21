
import { supabase } from '@/lib/supabase';

// Type pour un ami
export interface Ami {
  id: number;
  user_id: string;
  ami_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  // Données supplémentaires pour l'affichage
  nom?: string;
  email?: string;
  avatar_url?: string;
}

// Fonctions pour gérer les amis
export const fetchAmis = async (): Promise<Ami[]> => {
  try {
    // Récupérer l'ID de l'utilisateur connecté
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;

    if (!userId) {
      return [];
    }

    console.log('Récupération des amis pour l\'utilisateur:', userId);

    // Récupérer les amis (où l'utilisateur est soit l'initiateur, soit le destinataire)
    const { data, error } = await supabase
      .from('amis')
      .select('*')
      .or(`user_id.eq.${userId},ami_id.eq.${userId}`)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Erreur lors de la récupération des amis:', error);
      return [];
    }

    console.log('Amis récupérés:', data);
    
    return data as Ami[];
  } catch (error) {
    console.error('Erreur lors de la récupération des amis:', error);
    return [];
  }
};

// Fonction pour envoyer une demande d'ami
export const envoyerDemandeAmi = async (amiId: string): Promise<Ami> => {
  try {
    // Récupérer l'ID de l'utilisateur connecté
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;

    if (!userId) {
      throw new Error('Vous devez être connecté pour envoyer une demande d\'ami');
    }

    // Vérifier si une demande existe déjà
    const { data: existingRequest, error: checkError } = await supabase
      .from('amis')
      .select('*')
      .or(`and(user_id.eq.${userId},ami_id.eq.${amiId}),and(user_id.eq.${amiId},ami_id.eq.${userId})`)
      .maybeSingle();
    
    if (checkError) {
      console.error('Erreur lors de la vérification de la demande d\'ami:', checkError);
      throw checkError;
    }
    
    if (existingRequest) {
      throw new Error('Une demande d\'ami existe déjà avec cet utilisateur');
    }

    // Insérer la nouvelle demande d'ami
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
      throw error;
    }
    
    return data as Ami;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la demande d\'ami:', error);
    throw error;
  }
};

// Fonction pour accepter une demande d'ami
export const accepterDemandeAmi = async (amiId: number): Promise<Ami> => {
  try {
    // Récupérer l'ID de l'utilisateur connecté
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;

    if (!userId) {
      throw new Error('Vous devez être connecté pour accepter une demande d\'ami');
    }

    // Mise à jour du statut de la demande
    const { data, error } = await supabase
      .from('amis')
      .update({ status: 'accepted' })
      .eq('id', amiId)
      .eq('ami_id', userId) // S'assure que l'utilisateur est bien le destinataire
      .select()
      .single();
    
    if (error) {
      console.error('Erreur lors de l\'acceptation de la demande d\'ami:', error);
      throw error;
    }
    
    return data as Ami;
  } catch (error) {
    console.error('Erreur lors de l\'acceptation de la demande d\'ami:', error);
    throw error;
  }
};

// Fonction pour rejeter une demande d'ami
export const rejeterDemandeAmi = async (amiId: number): Promise<void> => {
  try {
    // Récupérer l'ID de l'utilisateur connecté
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;

    if (!userId) {
      throw new Error('Vous devez être connecté pour rejeter une demande d\'ami');
    }

    // Supprimer la demande
    const { error } = await supabase
      .from('amis')
      .delete()
      .eq('id', amiId)
      .or(`user_id.eq.${userId},ami_id.eq.${userId}`); // S'assure que l'utilisateur est impliqué
    
    if (error) {
      console.error('Erreur lors du rejet de la demande d\'ami:', error);
      throw error;
    }
  } catch (error) {
    console.error('Erreur lors du rejet de la demande d\'ami:', error);
    throw error;
  }
};

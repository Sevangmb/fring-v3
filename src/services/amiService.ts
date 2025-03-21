
import { supabase } from '@/lib/supabase';

// Type pour un ami
export interface Ami {
  id: number;
  user_id: string;
  ami_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  // Données supplémentaires pour l'affichage
  email?: string;
}

// Fonctions pour gérer les amis
export const fetchAmis = async (): Promise<Ami[]> => {
  try {
    // Récupérer l'ID de l'utilisateur connecté
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;

    if (!userId) {
      console.error('Aucun utilisateur connecté pour récupérer les amis');
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
      throw new Error(`Erreur de récupération des amis: ${error.message}`);
    }

    console.log('Amis récupérés:', data);
    
    return data as Ami[];
  } catch (error) {
    console.error('Erreur lors de la récupération des amis:', error);
    throw error;
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

    // Vérifier si l'ID de l'ami est valide
    if (!amiId) {
      throw new Error('ID d\'ami invalide');
    }

    console.log('Envoi d\'une demande d\'ami à:', amiId);

    // Vérifier si une demande existe déjà
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
      throw new Error(`Erreur d'envoi: ${error.message}`);
    }
    
    return data as Ami;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la demande d\'ami:', error);
    throw error;
  }
};

// Fonction pour accepter une demande d'ami
export const accepterDemandeAmi = async (amiId: number): Promise<Ami | null> => {
  try {
    // Récupérer l'ID de l'utilisateur connecté
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;

    if (!userId) {
      throw new Error('Vous devez être connecté pour accepter une demande d\'ami');
    }

    console.log('Acceptation de la demande d\'ami:', amiId);

    // Utiliser une requête SQL brute pour éviter les problèmes de trigger
    const { data, error } = await supabase
      .rpc('accepter_ami_simple', { 
        ami_id_param: amiId 
      });
    
    if (error) {
      console.error('Erreur lors de l\'acceptation de la demande d\'ami avec RPC:', error);
      // Fallback: essayer la méthode directe si RPC échoue
      try {
        const { data: directData, error: directError } = await supabase
          .from('amis')
          .update({ status: 'accepted' })
          .eq('id', amiId)
          .select()
          .single();
        
        if (directError) {
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
      // La RPC a réussi, récupérer la demande mise à jour
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
    
    console.error('La fonction RPC a échoué sans erreur spécifique');
    return null;
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

    console.log('Rejet/suppression de la demande d\'ami:', amiId);

    // Supprimer la demande
    const { error } = await supabase
      .from('amis')
      .delete()
      .eq('id', amiId)
      .or(`user_id.eq.${userId},ami_id.eq.${userId}`); // S'assure que l'utilisateur est impliqué
    
    if (error) {
      console.error('Erreur lors du rejet de la demande d\'ami:', error);
      throw new Error(`Erreur de rejet: ${error.message}`);
    }
  } catch (error) {
    console.error('Erreur lors du rejet de la demande d\'ami:', error);
    throw error;
  }
};

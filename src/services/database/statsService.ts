
import { supabase } from '@/lib/supabase';
import { Vetement } from '@/services/vetement/types';

/**
 * Récupère tous les vêtements de tous les utilisateurs pour l'administration
 */
export const getAllVetements = async (): Promise<Vetement[]> => {
  try {
    // Vérifier si l'utilisateur est authentifié et est un admin
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;
    const userEmail = sessionData.session?.user?.email;
    
    if (!userId || !userEmail) {
      throw new Error('Utilisateur non authentifié');
    }
    
    // Vérifier si l'utilisateur est un administrateur
    const adminEmails = ['admin@fring.app', 'sevans@hotmail.fr', 'pedro@hotmail.fr'];
    if (!adminEmails.includes(userEmail)) {
      throw new Error('Accès non autorisé');
    }
    
    // Récupérer tous les vêtements avec les informations du propriétaire
    const { data, error } = await supabase
      .from('vetements')
      .select(`
        *,
        profiles:user_id(email)
      `)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Erreur lors de la récupération des vêtements:', error);
      throw error;
    }
    
    return data as Vetement[];
  } catch (error) {
    console.error('Erreur lors de la récupération des vêtements:', error);
    throw error;
  }
};

/**
 * Compte le nombre total de vêtements dans la base de données
 */
export const getTotalVetementsCount = async (): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from('vetements')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error('Erreur lors du comptage des vêtements:', error);
      throw error;
    }
    
    return count || 0;
  } catch (error) {
    console.error('Erreur lors du comptage des vêtements:', error);
    return 0;
  }
};

/**
 * Récupère les vêtements qui n'ont pas de propriétaire
 */
export const getVetementsWithoutOwner = async (): Promise<Vetement[]> => {
  try {
    const { data, error } = await supabase
      .from('vetements')
      .select('*')
      .is('user_id', null);
    
    if (error) {
      console.error('Erreur lors de la récupération des vêtements sans propriétaire:', error);
      throw error;
    }
    
    return data as Vetement[];
  } catch (error) {
    console.error('Erreur lors de la récupération des vêtements sans propriétaire:', error);
    return [];
  }
};

/**
 * Récupère les vêtements pour un utilisateur spécifique
 */
export const getVetementsByUser = async (userId: string): Promise<Vetement[]> => {
  try {
    const { data, error } = await supabase
      .from('vetements')
      .select('*')
      .eq('user_id', userId);
    
    if (error) {
      console.error('Erreur lors de la récupération des vêtements de l\'utilisateur:', error);
      throw error;
    }
    
    return data as Vetement[];
  } catch (error) {
    console.error('Erreur lors de la récupération des vêtements de l\'utilisateur:', error);
    return [];
  }
};

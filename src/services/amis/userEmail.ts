
import { supabase } from '@/lib/supabase';

// Fonction pour obtenir l'email d'un utilisateur par son ID
export const getUserEmailById = async (userId: string): Promise<string | null> => {
  try {
    if (!userId) {
      console.log("Impossible de récupérer l'email: ID utilisateur manquant");
      return null;
    }
    
    // Cache local pour réduire les requêtes répétées
    if (emailCache[userId]) {
      return emailCache[userId];
    }
    
    console.log(`Tentative de récupération de l'email pour l'utilisateur ${userId}`);
    
    // Méthode directe plus fiable
    const { data, error } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.log("Erreur de récupération dans profiles, tentative dans auth.users");
      
      // Alternative: essayer directement dans auth.users via un RPC
      const { data: userData, error: rpcError } = await supabase
        .rpc('get_user_email_by_id', { user_id_param: userId });
      
      if (rpcError) {
        console.error(`Erreur RPC pour l'utilisateur ${userId}:`, rpcError);
        
        // Dernier recours: requête directe (si les politiques le permettent)
        const { data: authData, error: authError } = await supabase
          .from('users')
          .select('email')
          .eq('id', userId)
          .single();
        
        if (authError) {
          console.error(`Toutes les tentatives ont échoué pour l'utilisateur ${userId}`);
          return `Utilisateur ${userId.substring(0, 8)}`;
        }
        
        const email = authData?.email || null;
        if (email) emailCache[userId] = email;
        return email;
      }
      
      if (userData) emailCache[userId] = userData;
      return userData || null;
    }
    
    console.log(`Email récupéré avec succès: ${data?.email}`);
    if (data?.email) emailCache[userId] = data.email;
    return data?.email || null;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'email:', error);
    return null;
  }
};

// Cache pour stocker les emails par ID utilisateur
const emailCache: Record<string, string> = {};

// Fonction pour obtenir l'ID d'un utilisateur par son email
export const getUserIdByEmail = async (email: string): Promise<string | null> => {
  try {
    if (!email) return null;
    
    // Vérifier le cache inversé
    for (const [id, cachedEmail] of Object.entries(emailCache)) {
      if (cachedEmail === email) return id;
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();
    
    if (error || !data) {
      console.error(`Erreur lors de la récupération de l'ID pour ${email}:`, error);
      return null;
    }
    
    emailCache[data.id] = email;
    return data.id;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'ID:', error);
    return null;
  }
};

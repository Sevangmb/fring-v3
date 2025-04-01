
import { supabase } from '@/lib/supabase';

// Cache local pour réduire les requêtes répétées
const emailCache: Record<string, string> = {};
const idCache: Record<string, string> = {};

// Fonction pour obtenir l'email d'un utilisateur par son ID
export const getUserEmailById = async (userId: string): Promise<string | null> => {
  try {
    if (!userId) {
      console.log("Impossible de récupérer l'email: ID utilisateur manquant");
      return null;
    }
    
    // Vérifier le cache local
    if (emailCache[userId]) {
      return emailCache[userId];
    }
    
    console.log(`Tentative de récupération de l'email pour l'utilisateur ${userId}`);
    
    // Tentative via la RPC
    const { data: userData, error: rpcError } = await supabase
      .rpc('get_user_email_by_id', { user_id_param: userId });
    
    if (!rpcError && userData) {
      console.log(`Email récupéré avec succès via RPC: ${userData}`);
      emailCache[userId] = userData;
      if (userData) idCache[userData] = userId;
      return userData;
    }
    
    // Tentative alternative (si on a des privilèges)
    const { data, error } = await supabase.auth.admin.getUserById(userId);
    
    if (!error && data?.user?.email) {
      const email = data.user.email;
      console.log(`Email récupéré avec succès via admin API: ${email}`);
      emailCache[userId] = email;
      idCache[email] = userId;
      return email;
    }
    
    console.error(`Toutes les tentatives ont échoué pour l'utilisateur ${userId}`);
    
    // Retourner un format plus convivial
    return `Utilisateur`;
    
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'email:', error);
    return `Utilisateur`;
  }
};

// Fonction pour obtenir l'ID d'un utilisateur par son email
export const getUserIdByEmail = async (email: string): Promise<string | null> => {
  try {
    if (!email) return null;
    
    // Vérifier le cache inversé
    if (idCache[email]) {
      return idCache[email];
    }
    
    // Si ça ressemble à un UUID, c'est peut-être déjà un ID
    if (email.includes('-') && email.length > 30) {
      return email;
    }
    
    const { data, error } = await supabase
      .rpc('get_user_id_by_email', { email_param: email });
    
    if (error) {
      console.error(`Erreur lors de la récupération de l'ID pour ${email}:`, error);
      
      // Tentative alternative
      const { data: userData, error: searchError } = await supabase
        .from('auth.users')
        .select('id')
        .eq('email', email)
        .single();
      
      if (searchError || !userData) {
        console.error('Erreur lors de la recherche de l\'utilisateur:', searchError);
        return null;
      }
      
      idCache[email] = userData.id;
      emailCache[userData.id] = email;
      return userData.id;
    }
    
    if (data) {
      idCache[email] = data;
      emailCache[data] = email;
      return data;
    }
    
    return null;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'ID:', error);
    return null;
  }
};

// Fonction pour vérifier si une chaîne est un email
export const isEmail = (text: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text);
};

// Fonction pour résoudre l'ID ou l'email
export const resolveUserIdentifier = async (identifier: string): Promise<{id: string | null, email: string | null}> => {
  if (!identifier) return { id: null, email: null };
  
  // Si c'est déjà un email
  if (isEmail(identifier)) {
    const id = await getUserIdByEmail(identifier);
    return { id, email: identifier };
  }
  
  // Si c'est un UUID
  if (identifier.includes('-') && identifier.length > 30) {
    const email = await getUserEmailById(identifier);
    return { id: identifier, email };
  }
  
  // On ne sait pas, tentative de récupération avec les deux méthodes
  const email = await getUserEmailById(identifier);
  if (email && email !== `Utilisateur`) {
    return { id: identifier, email };
  }
  
  const id = await getUserIdByEmail(identifier);
  if (id) {
    return { id, email: identifier };
  }
  
  return { id: null, email: null };
};

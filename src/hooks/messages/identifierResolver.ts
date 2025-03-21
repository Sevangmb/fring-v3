
import { getUserEmailById, getUserIdByEmail, isEmail } from '@/services/amis/userEmail';

// Cache pour les résolutions d'identifiants
export interface ResolvedUser {
  id: string;
  email: string;
}

export const resolutionCache: Record<string, ResolvedUser> = {};

/**
 * Résout un email en identifiant utilisateur
 */
export const resolveToId = async (email: string): Promise<string | null> => {
  if (!email) return null;
  
  // Vérifier si l'email est déjà dans le cache
  if (resolutionCache[email] && resolutionCache[email].id) {
    console.log(`Résolution depuis le cache: ${email} -> ${resolutionCache[email].id}`);
    return resolutionCache[email].id;
  }
  
  try {
    console.log(`Tentative de résolution de l'email ${email} en ID`);
    const id = await getUserIdByEmail(email);
    
    if (id) {
      // Mettre en cache la résolution dans les deux sens
      resolutionCache[email] = { id, email };
      resolutionCache[id] = { id, email };
      console.log(`Email ${email} résolu en ID ${id}`);
      return id;
    }
    
    console.log(`Impossible de résoudre l'email ${email}`);
    return null;
  } catch (error) {
    console.error(`Erreur lors de la résolution de l'email ${email}:`, error);
    return null;
  }
};

/**
 * Résout un identifiant utilisateur (id ou email) en email et ID
 */
export const resolveIdentifier = async (
  identifier: string
): Promise<{ id: string | null; email: string | null }> => {
  if (!identifier) return { id: null, email: null };
  
  // Vérifier si l'identifiant est déjà dans le cache
  if (resolutionCache[identifier]) {
    console.log(`Identifiant résolu depuis le cache: ${identifier}`);
    return resolutionCache[identifier];
  }
  
  try {
    console.log(`Résolution de l'identifiant: ${identifier}`);
    let userId: string | null = null;
    let userEmail: string | null = null;
    
    // Si c'est un email, résoudre l'ID
    if (isEmail(identifier)) {
      userId = await getUserIdByEmail(identifier);
      userEmail = identifier;
      console.log(`Email ${identifier} résolu en ID ${userId}`);
    } 
    // Si c'est un ID, résoudre l'email
    else {
      userEmail = await getUserEmailById(identifier);
      userId = identifier;
      console.log(`ID ${identifier} résolu en email ${userEmail}`);
    }
    
    // Si une résolution a réussi, mettre à jour le cache
    if (userId && userEmail) {
      const result = { id: userId, email: userEmail };
      resolutionCache[userId] = result;
      resolutionCache[userEmail] = result;
      return result;
    }
    
    console.log(`Impossible de résoudre complètement l'identifiant ${identifier}`);
    
    // Retourner les informations partielles
    return { id: userId, email: userEmail };
  } catch (error) {
    console.error(`Erreur lors de la résolution de l'identifiant ${identifier}:`, error);
    return { id: null, email: null };
  }
};


import { getUserEmailById, getUserIdByEmail, isEmail } from '@/services/amis/userEmail';

// Cache pour les résolutions d'ID/email
export const resolutionCache: Record<string, {id: string, email: string}> = {};

/**
 * Résout un identifiant (email ou ID) en retournant à la fois l'ID et l'email
 */
export const resolveIdentifier = async (identifier: string): Promise<{id: string | null, email: string | null}> => {
  if (!identifier) return { id: null, email: null };
  
  // Vérifier le cache
  if (resolutionCache[identifier]) {
    return {
      id: resolutionCache[identifier].id,
      email: resolutionCache[identifier].email
    };
  }
  
  try {
    // Si c'est un email
    if (isEmail(identifier)) {
      const id = await getUserIdByEmail(identifier);
      if (id) {
        resolutionCache[identifier] = { id, email: identifier };
        resolutionCache[id] = { id, email: identifier };
        return { id, email: identifier };
      }
    }
    
    // Si c'est un ID
    else if (identifier.includes('-') && identifier.length > 30) {
      const email = await getUserEmailById(identifier);
      if (email) {
        resolutionCache[identifier] = { id: identifier, email };
        if (isEmail(email)) resolutionCache[email] = { id: identifier, email };
        return { id: identifier, email };
      }
    }
    
    return { id: null, email: null };
  } catch (error) {
    console.error('Erreur lors de la résolution de l\'identifiant:', error);
    return { id: null, email: null };
  }
};

/**
 * Résout un identifiant en ID uniquement
 */
export const resolveToId = async (identifierOrEmail: string): Promise<string | null> => {
  if (!identifierOrEmail) return null;
  
  try {
    const { id } = await resolveIdentifier(identifierOrEmail);
    return id;
  } catch (error) {
    console.error('Erreur lors de la résolution vers ID:', error);
    return null;
  }
};

/**
 * Résout un identifiant en email uniquement
 */
export const resolveToEmail = async (idOrEmail: string): Promise<string | null> => {
  if (!idOrEmail) return null;
  
  try {
    const { email } = await resolveIdentifier(idOrEmail);
    return email;
  } catch (error) {
    console.error('Erreur lors de la résolution vers email:', error);
    return null;
  }
};

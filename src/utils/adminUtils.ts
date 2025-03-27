
import { User } from "@supabase/supabase-js";

/**
 * Vérifie si un utilisateur a des privilèges d'administrateur
 * @param user L'objet utilisateur Supabase
 * @returns Vrai si l'utilisateur est un administrateur, faux sinon
 */
export const isAdmin = (user: User | null): boolean => {
  if (!user || !user.email) return false;
  
  const adminEmails = ['admin@fring.app', 'sevans@hotmail.fr', 'pedro@hotmail.fr'];
  return adminEmails.includes(user.email);
};

/**
 * Récupère la liste des adresses email administratives
 * @returns Un tableau d'adresses email
 */
export const getAdminEmails = (): string[] => {
  return ['admin@fring.app', 'sevans@hotmail.fr', 'pedro@hotmail.fr'];
};

/**
 * Hook personnalisé useAdmin pour vérifier les privilèges d'administrateur
 * @param user L'objet utilisateur Supabase
 * @returns Un objet avec l'état d'administrateur et les adresses email administratives
 */
export const useAdmin = (user: User | null) => {
  const adminStatus = isAdmin(user);
  const adminEmails = getAdminEmails();
  
  return {
    isAdmin: adminStatus,
    adminEmails
  };
};

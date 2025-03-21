
import { AuthError, Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useToast as useToastHook } from '@/hooks/use-toast';

// Définir correctement l'interface pour les propriétés des toasts
interface ToastOptions {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
}

// Fonction pour afficher un toast avec le hook useToast
// Utilisée en tant que type pour les arguments des fonctions d'authentification
type ShowToastFn = (options: ToastOptions) => void;

/**
 * Sign in with email and password
 */
export const signInWithEmailPassword = async (
  email: string, 
  password: string,
  showToast: ShowToastFn
): Promise<void> => {
  try {
    console.log("Tentative de connexion avec email:", email);
    const { error, data } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      console.error("Erreur de connexion:", error.message);
      showToast({
        title: "Erreur de connexion",
        description: error.message,
        variant: "destructive",
      });
      return Promise.reject(error);
    }
    
    console.log("Connexion réussie:", data.user?.id);
    showToast({
      title: "Connexion réussie",
      description: "Vous êtes maintenant connecté",
    });
    
    return Promise.resolve();
  } catch (error) {
    console.error("Exception lors de la connexion:", error);
    showToast({
      title: "Erreur de connexion",
      description: "Une erreur est survenue lors de la connexion",
      variant: "destructive",
    });
    return Promise.reject(error);
  }
};

/**
 * Sign up with email, password and name
 */
export const signUpWithEmailPassword = async (
  email: string, 
  password: string, 
  name: string,
  showToast: ShowToastFn
): Promise<void> => {
  try {
    console.log("Tentative d'inscription avec email:", email);
    const { error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: { name }
      }
    });
    
    if (error) {
      console.error("Erreur d'inscription:", error.message);
      showToast({
        title: "Erreur d'inscription",
        description: error.message,
        variant: "destructive",
      });
      return Promise.reject(error);
    }
    
    console.log("Inscription réussie pour:", email);
    showToast({
      title: "Inscription réussie",
      description: "Veuillez vérifier votre email pour confirmer votre compte",
    });
    
    return Promise.resolve();
  } catch (error) {
    console.error("Exception lors de l'inscription:", error);
    showToast({
      title: "Erreur d'inscription",
      description: "Une erreur est survenue lors de l'inscription",
      variant: "destructive",
    });
    return Promise.reject(error);
  }
};

/**
 * Sign out the current user
 */
export const signOutUser = async (
  showToast: ShowToastFn,
  clearUserState: () => void
): Promise<void> => {
  try {
    console.log("Tentative de déconnexion");
    
    // Nettoyer l'état local avant de tenter la déconnexion côté serveur
    clearUserState();
    
    // Tenter la déconnexion côté serveur
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      // Si l'erreur est 'Session not found', ce n'est pas grave puisqu'on veut se déconnecter
      // et nous avons déjà nettoyé l'état local
      if (error.message.includes('Session not found')) {
        console.log("Session déjà expirée, déconnexion locale effectuée");
        showToast({
          title: "Déconnexion réussie",
          description: "Vous avez été déconnecté avec succès",
        });
        return Promise.resolve();
      }
      
      // Pour les autres types d'erreurs, on les signale
      console.error("Erreur de déconnexion:", error.message);
      showToast({
        title: "Erreur de déconnexion",
        description: error.message,
        variant: "destructive",
      });
      return Promise.reject(error);
    }
    
    console.log("Déconnexion réussie");
    showToast({
      title: "Déconnexion réussie",
      description: "Vous avez été déconnecté avec succès",
    });
    
    return Promise.resolve();
  } catch (error) {
    console.error("Exception lors de la déconnexion:", error);
    showToast({
      title: "Erreur de déconnexion",
      description: "Une erreur est survenue lors de la déconnexion",
      variant: "destructive",
    });
    return Promise.reject(error);
  }
};

/**
 * Initialize the auth session
 */
export const initializeAuthSession = async (): Promise<{
  session: Session | null;
  error: AuthError | null;
}> => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.warn('Erreur lors de la récupération de la session:', error.message);
    } else {
      console.log("Session récupérée:", session ? "Connecté" : "Pas de session");
    }
    
    return { session, error };
  } catch (error) {
    console.warn('Erreur lors de l\'initialisation de l\'authentification:', error);
    return { session: null, error: error as AuthError };
  }
};

/**
 * Set up auth state change listener
 */
export const setupAuthListener = (
  setAuthState: (user: User | null, session: Session | null) => void
) => {
  try {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session ? "Session présente" : "Pas de session");
        setAuthState(session?.user ?? null, session);
      }
    );

    return subscription;
  } catch (error) {
    console.warn('Erreur lors de la configuration des événements d\'authentification:', error);
    return { unsubscribe: () => {} };
  }
};

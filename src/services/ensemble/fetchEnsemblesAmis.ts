
import { supabase } from '@/lib/supabase';
import { Ensemble } from './types';
import { writeLog } from '@/services/logs';

/**
 * Récupère les ensembles des amis d'un utilisateur
 * @returns Liste des ensembles des amis
 */
export const fetchEnsemblesAmis = async (friendId?: string): Promise<Ensemble[]> => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;
    
    if (!userId) {
      writeLog(
        "Tentative d'accès aux ensembles sans authentification",
        'warning',
        undefined,
        'ensembles'
      );
      return [];
    }

    console.log("Appel à fetchEnsemblesAmis avec friendId:", friendId);
    
    // Si friendId est undefined ou vide, utiliser la fonction qui récupère tous les ensembles d'amis
    if (!friendId || friendId === "all") {
      console.log("Récupération des ensembles pour tous les amis");
      
      try {
        const { data, error } = await supabase.rpc('get_friends_ensembles');

        if (error) {
          console.error("Erreur lors de la récupération des ensembles des amis:", error);
          
          // Enregistrer l'erreur dans les logs
          writeLog(
            "Erreur lors de la récupération des ensembles des amis",
            'error',
            error.message,
            'ensembles'
          );
          
          throw error;
        }

        if (!data || !Array.isArray(data)) {
          console.log("Aucun ensemble trouvé ou format de données inattendu");
          return [];
        }

        console.log("Données d'ensembles reçues:", data.length);
        
        // Normaliser la structure des données
        return formatEnsemblesData(data);
      } catch (error) {
        // Si c'est une erreur qui indique que l'utilisateur n'a pas d'amis,
        // retourner un tableau vide au lieu de propager l'erreur
        if (error && typeof error === 'object' && 'message' in error &&
            typeof error.message === 'string' && 
            error.message.includes("n'a aucun ami")) {
          console.log("L'utilisateur n'a pas d'amis acceptés.");
          return [];
        }
        
        // Sinon propager l'erreur
        throw error;
      }
    } else {
      // Sinon utiliser la fonction qui récupère les ensembles d'un ami spécifique
      console.log("Récupération des ensembles pour un ami spécifique:", friendId);
      
      // Vérification pour éviter d'appeler avec son propre ID
      if (friendId === userId) {
        console.log("Tentative de récupérer ses propres ensembles comme si c'était un ami, redirection vers fetchEnsembles");
        
        // Dans ce cas, on pourrait théoriquement appeler fetchEnsembles()
        // Mais comme cette fonction n'est pas destinée à récupérer ses propres ensembles,
        // nous retournons un tableau vide avec un log d'avertissement
        writeLog(
          "Tentative d'accès à ses propres ensembles via la fonction des amis",
          'warning',
          `User ID: ${userId}`,
          'ensembles'
        );
        return [];
      }
      
      try {
        const { data, error } = await supabase.rpc('get_friend_ensembles', { 
          friend_id_param: friendId 
        });

        if (error) {
          console.error("Erreur lors de la récupération des ensembles d'un ami spécifique:", error);
          
          // Enregistrer l'erreur dans les logs
          writeLog(
            "Erreur lors de la récupération des ensembles d'un ami spécifique",
            'error',
            error.message,
            'ensembles'
          );
          
          throw error;
        }

        if (!data || !Array.isArray(data)) {
          console.log("Aucun ensemble trouvé pour cet ami ou format de données inattendu");
          return [];
        }

        console.log("Données d'ensembles reçues pour ami spécifique:", data.length);
        
        // Normaliser la structure des données 
        return formatEnsemblesData(data);
      } catch (error) {
        // Si c'est une erreur qui indique que l'utilisateur n'est pas ami,
        // le logger mais quand même propager l'erreur
        if (error && typeof error === 'object' && 'message' in error &&
            typeof error.message === 'string' && 
            error.message.includes("n'est pas dans vos amis")) {
          
          writeLog(
            "Tentative d'accès aux ensembles d'un non-ami",
            'warning',
            `Friend ID: ${friendId}`,
            'ensembles'
          );
        }
        
        // Propager l'erreur
        throw error;
      }
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des ensembles des amis:", error);
    writeLog(
      "Erreur lors de la récupération des ensembles des amis",
      'error',
      error instanceof Error ? error.message : 'Erreur inconnue',
      'ensembles'
    );
    throw error;
  }
};

// Fonction helper pour formater les données des ensembles
const formatEnsemblesData = (data: any[]): Ensemble[] => {
  return data.map((ensemble: any) => {
    // S'assurer que les vêtements sont un tableau et pas une chaîne JSON
    let vetements = ensemble.vetements;
    if (typeof vetements === 'string') {
      try {
        vetements = JSON.parse(vetements);
      } catch (e) {
        console.error("Erreur lors du parsing des vêtements:", e);
        vetements = [];
      }
    }

    // Si vetements n'est toujours pas un tableau, le convertir en tableau vide
    if (!Array.isArray(vetements)) {
      vetements = [];
    }

    return {
      id: ensemble.id,
      nom: ensemble.nom || "Ensemble sans nom",
      description: ensemble.description || "",
      occasion: ensemble.occasion || "",
      saison: ensemble.saison || "",
      created_at: ensemble.created_at,
      user_id: ensemble.user_id,
      vetements: vetements,
      email: ensemble.email || ""
    };
  });
};

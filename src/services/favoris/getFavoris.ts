
import { supabase } from '@/lib/supabase';
import { Favori, FavoriWithDetails } from './types';
import { fetchVetementById } from '../vetement/fetchVetementById';
import { fetchEnsembleById } from '../ensemble/fetchEnsembleById';

/**
 * Récupère tous les favoris de l'utilisateur
 */
export const getFavoris = async (): Promise<Favori[]> => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;

    if (!userId) {
      return [];
    }

    const { data, error } = await supabase
      .from('favoris')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Erreur lors de la récupération des favoris:", error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Erreur lors de la récupération des favoris:", error);
    return [];
  }
};

/**
 * Récupère tous les favoris de l'utilisateur avec leurs détails
 */
export const getFavorisWithDetails = async (): Promise<FavoriWithDetails[]> => {
  try {
    const favoris = await getFavoris();
    
    // Enrichir chaque favori avec ses détails spécifiques
    const favorisWithDetails = await Promise.all(
      favoris.map(async (favori) => {
        let details = null;
        let nom = undefined;
        
        // Récupérer les détails en fonction du type de favori
        if (favori.type_favori === 'vetement') {
          try {
            const vetement = await fetchVetementById(parseInt(favori.element_id));
            if (vetement && Object.keys(vetement).length > 0) {
              details = vetement;
              nom = vetement.nom;
            }
          } catch (err) {
            console.error("Erreur lors de la récupération du vêtement favori:", err);
          }
        } else if (favori.type_favori === 'ensemble') {
          try {
            const ensemble = await fetchEnsembleById(parseInt(favori.element_id));
            if (ensemble && Object.keys(ensemble).length > 0) {
              details = ensemble;
              nom = ensemble.nom;
            }
          } catch (err) {
            console.error("Erreur lors de la récupération de l'ensemble favori:", err);
          }
        } else if (favori.type_favori === 'utilisateur') {
          // Implémentation pour les utilisateurs à ajouter ultérieurement
        }
        
        return {
          ...favori,
          details,
          nom
        };
      })
    );
    
    return favorisWithDetails;
  } catch (error) {
    console.error("Erreur lors de la récupération des favoris avec détails:", error);
    return [];
  }
};

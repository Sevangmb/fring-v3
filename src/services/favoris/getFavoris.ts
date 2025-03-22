
import { supabase } from '@/lib/supabase';
import { Favori, FavoriWithDetails } from './types';
import { fetchVetementById } from '../vetement';
import { fetchEnsembleById } from '../ensemble';
import { getUserById } from '../userService';

/**
 * Récupère tous les favoris d'un utilisateur
 */
export const getFavoris = async (): Promise<Favori[]> => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;

    if (!userId) {
      throw new Error("Utilisateur non connecté");
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
 * Vérifie si un élément est dans les favoris
 */
export const isFavori = async (
  type: 'utilisateur' | 'vetement' | 'ensemble',
  elementId: string | number
): Promise<boolean> => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;

    if (!userId) {
      return false;
    }

    // Convertir elementId en string s'il est de type number
    const elementIdStr = elementId.toString();

    const { data, error } = await supabase
      .from('favoris')
      .select('id')
      .eq('user_id', userId)
      .eq('type_favori', type)
      .eq('element_id', elementIdStr)
      .maybeSingle();

    if (error) {
      console.error("Erreur lors de la vérification du favori:", error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error("Erreur lors de la vérification du favori:", error);
    return false;
  }
};

/**
 * Récupère les favoris avec les détails
 */
export const getFavorisWithDetails = async (): Promise<FavoriWithDetails[]> => {
  try {
    const favoris = await getFavoris();
    
    // Regrouper les favoris par type pour optimiser les requêtes
    const vetementIds = favoris
      .filter(f => f.type_favori === 'vetement')
      .map(f => parseInt(f.element_id, 10));
    
    const ensembleIds = favoris
      .filter(f => f.type_favori === 'ensemble')
      .map(f => parseInt(f.element_id, 10));
    
    const utilisateurIds = favoris
      .filter(f => f.type_favori === 'utilisateur')
      .map(f => f.element_id);
    
    // Récupérer les détails en parallèle pour chaque type
    const [vetements, ensembles, utilisateurs] = await Promise.all([
      Promise.all(vetementIds.map(id => fetchVetementById(id).catch(() => null))),
      Promise.all(ensembleIds.map(id => fetchEnsembleById(id).catch(() => null))),
      Promise.all(utilisateurIds.map(id => getUserById(id).catch(() => null)))
    ]);
    
    // Associer les détails aux favoris
    return favoris.map(favori => {
      const result: FavoriWithDetails = { ...favori };
      
      if (favori.type_favori === 'vetement') {
        const vetement = vetements.find(v => v && v.id === parseInt(favori.element_id, 10));
        result.details = vetement || null;
        result.nom = vetement?.nom || "Vêtement supprimé";
      } 
      else if (favori.type_favori === 'ensemble') {
        const ensemble = ensembles.find(e => e && e.id === parseInt(favori.element_id, 10));
        result.details = ensemble || null;
        result.nom = ensemble?.nom || "Ensemble supprimé";
      } 
      else if (favori.type_favori === 'utilisateur') {
        const utilisateur = utilisateurs.find(u => u && u.id === favori.element_id);
        result.details = utilisateur || null;
        result.nom = utilisateur?.email || "Utilisateur supprimé";
      }
      
      return result;
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des détails des favoris:", error);
    return [];
  }
};

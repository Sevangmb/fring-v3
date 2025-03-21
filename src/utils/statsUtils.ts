import { supabase } from "@/lib/supabase";
import { Vetement } from "@/services/vetement/types";

/**
 * Fetches all clothes for a specific user
 */
export const fetchVetementsStats = async (userId: string): Promise<Vetement[]> => {
  const { data: vetements, error: vetementsError } = await supabase
    .from('vetements')
    .select('*')
    .eq('user_id', userId);

  if (vetementsError) throw vetementsError;
  return vetements || [];
};

/**
 * Fetches the total count of outfits
 */
export const fetchTenutesCount = async (): Promise<number> => {
  const { count, error: tenuesError } = await supabase
    .from('tenues')
    .select('*', { count: 'exact', head: true });

  if (tenuesError) throw tenuesError;
  return count || 0;
};

/**
 * Fetches the count of accepted friends for a user
 */
export const fetchAmisCount = async (userId: string): Promise<number> => {
  const { data: amis, error: amisError } = await supabase
    .from('amis')
    .select('*')
    .or(`user_id.eq.${userId},ami_id.eq.${userId}`)
    .eq('status', 'accepted');

  if (amisError) throw amisError;
  return amis?.length || 0;
};

/**
 * Calculates distribution of clothes by category, color and brand
 */
export const calculateDistributions = (vetements: Vetement[]) => {
  const categories: Record<string, number> = {};
  const couleurs: Record<string, number> = {};
  const marques: Record<string, number> = {};

  vetements.forEach((vetement: Vetement) => {
    // Catégories
    if (vetement.categorie) {
      categories[vetement.categorie] = (categories[vetement.categorie] || 0) + 1;
    }

    // Couleurs
    if (vetement.couleur) {
      couleurs[vetement.couleur] = (couleurs[vetement.couleur] || 0) + 1;
    }

    // Marques
    if (vetement.marque) {
      marques[vetement.marque] = (marques[vetement.marque] || 0) + 1;
    }
  });

  // Transform to arrays for charts
  const categoriesDistribution = Object.entries(categories)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const couleursDistribution = Object.entries(couleurs)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const marquesDistribution = Object.entries(marques)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    categoriesDistribution,
    couleursDistribution,
    marquesDistribution
  };
};

/**
 * Prepares recent activity data from vetements
 */
export const prepareRecentActivity = (vetements: Vetement[]) => {
  return vetements
    .sort((a: Vetement, b: Vetement) => {
      return new Date(b.created_at || "").getTime() - new Date(a.created_at || "").getTime();
    })
    .slice(0, 5)
    .map((vetement: Vetement) => ({
      type: "vêtement",
      date: vetement.created_at || "",
      description: `Ajout de ${vetement.nom}`,
    }));
};

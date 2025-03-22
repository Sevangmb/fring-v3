
import { supabase } from "@/lib/supabase";
import { Vetement } from "@/services/vetement/types";

/**
 * Interface for vetement with categories relationship
 */
export interface VetementWithCategories {
  id: number;
  nom: string;
  couleur: string;
  taille: string;
  description?: string;
  marque?: string;
  image_url?: string;
  created_at?: string;
  user_id?: string;
  categories?: {
    id: number;
    nom: string;
  }[];
}

/**
 * Interface for dashboard statistics
 */
export interface DashboardStats {
  totalVetements: number;
  totalTenues: number;
  totalAmis: number;
  categoriesDistribution: { name: string; count: number }[];
  couleursDistribution: { name: string; count: number }[];
  marquesDistribution: { name: string; count: number }[];
  recentActivity: {
    type: string;
    date: string;
    description: string;
  }[];
}

/**
 * Fetches all clothes with their categories for a specific user
 */
export const fetchVetementsStats = async (userId: string): Promise<VetementWithCategories[]> => {
  console.log("Récupération des vêtements pour l'utilisateur:", userId);
  
  const { data: vetements, error: vetementsError } = await supabase
    .from('vetements')
    .select(`
      id, nom, couleur, taille, description, marque, image_url, created_at, user_id,
      categories!vetements_categorie_id_fkey(id, nom)
    `)
    .eq('user_id', userId);

  if (vetementsError) {
    console.error("Erreur lors de la récupération des vêtements:", vetementsError);
    throw vetementsError;
  }
  
  console.log("Vêtements récupérés:", vetements?.length || 0);
  return vetements as VetementWithCategories[] || [];
};

/**
 * Fetches the total count of outfits for a user
 */
export const fetchTenutesCount = async (userId: string): Promise<number> => {
  // La table tenues n'a pas de colonne user_id, nous allons chercher les tenues
  // via la table tenues_vetements qui relie les tenues aux vêtements de l'utilisateur
  try {
    // On récupère d'abord les IDs des vêtements de l'utilisateur
    const { data: userVetements, error: vetementsError } = await supabase
      .from('vetements')
      .select('id')
      .eq('user_id', userId);
    
    if (vetementsError) throw vetementsError;
    
    if (!userVetements || userVetements.length === 0) {
      return 0; // L'utilisateur n'a pas de vêtements, donc pas de tenues
    }
    
    const vetementIds = userVetements.map(v => v.id);
    
    // Ensuite on récupère les tenues distinctes liées à ces vêtements
    const { data: tenues, error: tenuesError } = await supabase
      .from('tenues_vetements')
      .select('tenue_id')
      .in('vetement_id', vetementIds)
      .is('tenue_id', 'not.null');
    
    if (tenuesError) throw tenuesError;
    
    // On compte le nombre de tenues distinctes
    const uniqueTenueIds = [...new Set(tenues?.map(t => t.tenue_id) || [])];
    
    console.log("Nombre de tenues:", uniqueTenueIds.length || 0);
    return uniqueTenueIds.length || 0;
  } catch (error) {
    console.error("Erreur lors de la récupération des tenues:", error);
    throw error;
  }
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

  if (amisError) {
    console.error("Erreur lors de la récupération des amis:", amisError);
    throw amisError;
  }
  
  console.log("Nombre d'amis:", amis?.length || 0);
  return amis?.length || 0;
};

/**
 * Calculates distribution of clothes by category, color and brand
 */
export const calculateDistributions = (vetements: VetementWithCategories[]) => {
  const categorieCount: Record<string, number> = {};
  const couleurCount: Record<string, number> = {};
  const marqueCount: Record<string, number> = {};

  vetements.forEach((vetement) => {
    // Catégories - accéder au premier élément du tableau si disponible
    if (vetement.categories && vetement.categories.length > 0 && vetement.categories[0].nom) {
      const categoryName = vetement.categories[0].nom;
      categorieCount[categoryName] = (categorieCount[categoryName] || 0) + 1;
    }

    // Couleurs
    if (vetement.couleur) {
      couleurCount[vetement.couleur] = (couleurCount[vetement.couleur] || 0) + 1;
    }

    // Marques
    if (vetement.marque) {
      marqueCount[vetement.marque] = (marqueCount[vetement.marque] || 0) + 1;
    }
  });

  // Transform to arrays for charts
  const categoriesDistribution = Object.entries(categorieCount)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const couleursDistribution = Object.entries(couleurCount)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const marquesDistribution = Object.entries(marqueCount)
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
export const prepareRecentActivity = (vetements: VetementWithCategories[]) => {
  return vetements
    .sort((a, b) => {
      return new Date(b.created_at || "").getTime() - new Date(a.created_at || "").getTime();
    })
    .slice(0, 5)
    .map((vetement) => ({
      type: "vêtement",
      date: vetement.created_at || "",
      description: `Ajout de ${vetement.nom}`,
    }));
};

/**
 * Creates the initial dashboard stats object
 */
export const createEmptyDashboardStats = (): DashboardStats => ({
  totalVetements: 0,
  totalTenues: 0,
  totalAmis: 0,
  categoriesDistribution: [],
  couleursDistribution: [],
  marquesDistribution: [],
  recentActivity: []
});

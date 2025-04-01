
import { VetementWithCategories } from "./types";

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


/**
 * Organise les vêtements d'un ensemble par type
 */
export const organizeVetementsByType = (vetements: any[] = []): Record<string, any[]> => {
  if (!vetements || vetements.length === 0) {
    return {};
  }

  const categoriesMap: Record<number, string> = {
    1: "Hauts",
    2: "Bas",
    3: "Chaussures",
    4: "Accessoires",
    5: "Manteaux",
    // Ajoutez d'autres catégories au besoin
  };

  // Préparer un objet pour stocker les vêtements par type
  const result: Record<string, any[]> = {};

  // Parcourir chaque vêtement et l'ajouter à sa catégorie
  vetements.forEach(item => {
    if (!item.vetement) return;
    
    // Vérifier si vetement est un tableau ou un objet
    const vetement = Array.isArray(item.vetement) ? item.vetement[0] : item.vetement;
    if (!vetement) return;
    
    // Déterminer la catégorie
    const categorieId = vetement.categorie_id;
    const categorieName = categoriesMap[categorieId] || "Autres";
    
    // Créer le tableau pour cette catégorie s'il n'existe pas
    if (!result[categorieName]) {
      result[categorieName] = [];
    }
    
    // Ajouter le vêtement à sa catégorie
    result[categorieName].push({
      id: vetement.id,
      nom: vetement.nom,
      description: vetement.description,
      image_url: vetement.image_url,
      couleur: vetement.couleur,
      marque: vetement.marque,
      taille: vetement.taille
    });
  });

  return result;
};

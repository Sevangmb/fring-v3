
/**
 * Fonction qui organise les vêtements par catégorie
 */
export const organizeVetementsByType = (vetements: any[]): Record<string, any[]> => {
  const types: Record<string, any[]> = {
    hauts: [],
    bas: [],
    chaussures: [],
    accessoires: [],
    autres: []
  };
  
  if (!vetements || !Array.isArray(vetements)) {
    console.warn("Les vêtements ne sont pas dans un format valide pour l'organisation:", vetements);
    return types;
  }
  
  // Parcourir tous les vêtements et les organiser par catégorie
  vetements.forEach(item => {
    // Vérifier si l'objet vêtement est correctement formaté
    let vetement;
    
    if (item && item.vetement) {
      // Format standard des jointures de la base de données
      vetement = item.vetement;
    } else if (item && typeof item === 'object' && 'categorie_id' in item) {
      // Format direct de l'objet vêtement
      vetement = item;
    } else {
      console.warn("Format de vêtement non reconnu:", item);
      return;
    }
    
    if (!vetement) {
      return;
    }
    
    // Déterminer la catégorie en fonction du categorie_id
    const categorieId = vetement.categorie_id;
    
    if (categorieId === 1 || categorieId === 4) {
      // Hauts et vestes
      types.hauts.push(vetement);
    } else if (categorieId === 2 || categorieId === 5) {
      // Bas et jupes
      types.bas.push(vetement);
    } else if (categorieId === 3) {
      // Chaussures
      types.chaussures.push(vetement);
    } else if (categorieId === 6) {
      // Accessoires
      types.accessoires.push(vetement);
    } else {
      // Tout autre type
      types.autres.push(vetement);
    }
  });
  
  return types;
};

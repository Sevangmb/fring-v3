
/**
 * Utilities pour normaliser les catégories de vêtements détectées
 */

/**
 * Normalise la catégorie détectée selon un mapping prédéfini
 * @param category Catégorie détectée
 * @returns Catégorie normalisée
 */
export function normalizeCategory(category: string): string {
  // Normalisation des catégories en français
  const categoryMapping: Record<string, string> = {
    "t-shirt": "T-shirt",
    "tshirt": "T-shirt",
    "t shirt": "T-shirt",
    "shirt": "Chemise", 
    "chemise": "Chemise",
    "pants": "Pantalon",
    "pantalon": "Pantalon",
    "jeans": "Jeans",
    "jean": "Jeans",
    "shorts": "Short",
    "short": "Short",
    "dress": "Robe",
    "robe": "Robe",
    "skirt": "Jupe",
    "jupe": "Jupe",
    "jacket": "Veste",
    "veste": "Veste",
    "coat": "Manteau",
    "manteau": "Manteau",
    "sweater": "Pull",
    "pull": "Pull",
    "hoodie": "Pull",
    "sweatshirt": "Pull"
  };
  
  if (!category) return "T-shirt"; // Valeur par défaut
  
  // Recherche de correspondance exacte ou partielle
  for (const [key, value] of Object.entries(categoryMapping)) {
    if (category.toLowerCase().includes(key.toLowerCase())) {
      console.log(`Category match found: ${key} -> ${value}`);
      return value;
    }
  }
  
  // Si aucune correspondance trouvée
  return "T-shirt";
}

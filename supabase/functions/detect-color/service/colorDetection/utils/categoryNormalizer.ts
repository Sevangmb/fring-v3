
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
    // T-shirts et hauts
    "t-shirt": "T-shirt",
    "tshirt": "T-shirt",
    "t shirt": "T-shirt",
    "t-shirts": "T-shirt",
    "top": "T-shirt",
    "maillot": "T-shirt",
    
    // Chemises
    "shirt": "Chemise", 
    "chemise": "Chemise",
    "blouse": "Chemise",
    
    // Pantalons
    "pants": "Pantalon",
    "pantalon": "Pantalon",
    "trousers": "Pantalon",
    "pantalons": "Pantalon",
    
    // Jeans
    "jeans": "Jeans",
    "jean": "Jeans",
    "denim": "Jeans",
    
    // Shorts
    "shorts": "Short",
    "short": "Short",
    "bermuda": "Short",
    
    // Robes
    "dress": "Robe",
    "robe": "Robe",
    "dresses": "Robe",
    
    // Jupes
    "skirt": "Jupe",
    "jupe": "Jupe",
    "jupes": "Jupe",
    "skirts": "Jupe",
    
    // Vestes et manteaux
    "jacket": "Veste",
    "veste": "Veste",
    "blouson": "Veste",
    "coat": "Manteau",
    "manteau": "Manteau",
    "doudoune": "Manteau",
    "parka": "Manteau",
    "anorak": "Manteau",
    "imperméable": "Manteau",
    "impermeable": "Manteau",
    
    // Pulls et sweats
    "sweater": "Pull",
    "pull": "Pull",
    "pullover": "Pull",
    "pull-over": "Pull",
    "hoodie": "Pull",
    "sweatshirt": "Pull",
    "sweat": "Pull",
    "cardigan": "Pull",
    
    // Chaussures
    "shoes": "Chaussures",
    "chaussures": "Chaussures",
    "chaussure": "Chaussures",
    "sneakers": "Chaussures",
    "baskets": "Chaussures",
    "boots": "Chaussures",
    "bottines": "Chaussures",
    "sandals": "Chaussures",
    "sandales": "Chaussures",
    "tongs": "Chaussures",
    "tong": "Chaussures",
    "flip-flops": "Chaussures",
    "flip flops": "Chaussures"
  };
  
  if (!category) return "T-shirt"; // Valeur par défaut
  
  // Recherche de correspondance exacte ou partielle
  for (const [key, value] of Object.entries(categoryMapping)) {
    if (category.toLowerCase().includes(key.toLowerCase())) {
      console.log(`Category match found: ${key} -> ${value}`);
      return value;
    }
  }
  
  // Si aucune correspondance trouvée, essayons de déterminer le type général
  const categoryLower = category.toLowerCase();
  
  if (categoryLower.includes("haut") || categoryLower.includes("top")) {
    return "T-shirt";
  } else if (categoryLower.includes("bas") || categoryLower.includes("bottom")) {
    return "Pantalon";
  } else if (categoryLower.includes("veste") || categoryLower.includes("jacket")) {
    return "Veste";
  } else if (categoryLower.includes("chauss") || categoryLower.includes("shoe") || 
             categoryLower.includes("tong") || categoryLower.includes("sandal")) {
    return "Chaussures";
  }
  
  // Si toujours aucune correspondance trouvée
  return category.charAt(0).toUpperCase() + category.slice(1);
}

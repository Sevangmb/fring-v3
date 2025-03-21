
import { colorMapping } from "../../utils/colorMapping.ts";
import { availableColors } from "../../utils/colorMapping.ts";

/**
 * Mappe la couleur détectée en anglais vers son équivalent français
 * @param detectedColor Couleur détectée en anglais
 * @param isBottom Indique si c'est un pantalon/jeans
 * @returns Couleur en français
 */
export function mapToFrenchColor(detectedColor: string, isBottom: boolean = false): string {
  console.log("Mapping detected color to French:", detectedColor);
  
  // Si c'est un pantalon/jeans, retourner bleu directement
  if (isBottom) {
    console.log("Bottom garment detected, returning blue");
    return "bleu";
  }
  
  for (const [englishColor, frenchColor] of Object.entries(colorMapping)) {
    if (detectedColor.includes(englishColor)) {
      console.log(`Mapped '${detectedColor}' to '${frenchColor}'`);
      return frenchColor;
    }
  }
  
  // Si aucune correspondance n'est trouvée, chercher la couleur la plus proche au lieu de renvoyer "multicolore"
  console.log("No direct color mapping found for:", detectedColor);
  
  // Essayer de trouver une correspondance partielle
  for (const [englishColor, frenchColor] of Object.entries(colorMapping)) {
    if (detectedColor.includes(englishColor)) {
      console.log(`Found partial match '${englishColor}' -> '${frenchColor}'`);
      return frenchColor;
    }
  }
  
  // Si toujours pas de correspondance, chercher le mot le plus proche dans le texte
  const words = detectedColor.split(/\s+/);
  for (const word of words) {
    for (const [englishColor, frenchColor] of Object.entries(colorMapping)) {
      if (word === englishColor) {
        console.log(`Found word match '${word}' -> '${frenchColor}'`);
        return frenchColor;
      }
    }
  }
  
  // Si on arrive ici, retourner une couleur par défaut basée sur les mots clés
  if (detectedColor.includes("dark")) {
    return "noir";
  } else if (detectedColor.includes("light")) {
    return "blanc";
  }
  
  // En dernier recours, retourner la première couleur disponible (souvent bleu)
  return availableColors[0];
}

/**
 * Mappe la catégorie de vêtement en anglais vers son équivalent français
 * @param category Catégorie en anglais
 * @returns Catégorie en français
 */
export function mapToFrenchCategory(category: string): string {
  const categoryMapping: Record<string, string> = {
    'shirt': 'Chemise',
    't-shirt': 'T-shirt',
    'tshirt': 'T-shirt',
    'pants': 'Pantalon',
    'jeans': 'Jeans',
    'dress': 'Robe',
    'skirt': 'Jupe',
    'jacket': 'Veste',
    'coat': 'Manteau',
    'sweater': 'Pull',
    'hoodie': 'Sweat',
    'shoes': 'Chaussures',
    'boots': 'Bottes',
    'hat': 'Chapeau',
    'socks': 'Chaussettes',
    'shorts': 'Short',
    'top': 'Haut',
    'blouse': 'Blouse',
    'suit': 'Costume',
    'underwear': 'Sous-vêtement',
    'lingerie': 'Lingerie',
    'swimwear': 'Maillot de bain',
    'scarf': 'Écharpe',
    'gloves': 'Gants',
    'belt': 'Ceinture',
    'tie': 'Cravate',
    'bag': 'Sac',
    'jewelry': 'Bijou'
  };

  // Convertir en minuscules pour la comparaison
  const lowerCategory = category.toLowerCase();
  
  // Trouver une correspondance exacte
  for (const [englishCategory, frenchCategory] of Object.entries(categoryMapping)) {
    if (lowerCategory === englishCategory) {
      return frenchCategory;
    }
  }
  
  // Chercher une correspondance partielle
  for (const [englishCategory, frenchCategory] of Object.entries(categoryMapping)) {
    if (lowerCategory.includes(englishCategory)) {
      return frenchCategory;
    }
  }
  
  // Si aucune correspondance n'est trouvée
  return category.charAt(0).toUpperCase() + category.slice(1);
}

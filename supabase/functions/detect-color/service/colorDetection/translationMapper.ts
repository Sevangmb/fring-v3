
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
  
  // Nettoyage de la couleur détectée pour éviter les problèmes
  const cleanColor = detectedColor.toLowerCase().trim();
  
  // Liste des couleurs de base pour une correspondance directe
  const basicColors = {
    "red": "rouge",
    "blue": "bleu",
    "green": "vert",
    "yellow": "jaune",
    "black": "noir",
    "white": "blanc",
    "purple": "violet",
    "pink": "rose",
    "orange": "orange",
    "brown": "marron",
    "gray": "gris",
    "grey": "gris",
    "beige": "beige"
  };
  
  // Vérifier d'abord les correspondances directes avec les couleurs de base
  if (basicColors[cleanColor]) {
    console.log(`Direct match found for '${cleanColor}': '${basicColors[cleanColor]}'`);
    return basicColors[cleanColor];
  }
  
  // Tentative de correspondance directe avec le mapping complet
  for (const [englishColor, frenchColor] of Object.entries(colorMapping)) {
    if (cleanColor === englishColor.toLowerCase()) {
      console.log(`Mapped '${cleanColor}' to '${frenchColor}'`);
      return frenchColor;
    }
  }
  
  // Tentative de correspondance partielle
  for (const [englishColor, frenchColor] of Object.entries(colorMapping)) {
    if (cleanColor.includes(englishColor.toLowerCase())) {
      console.log(`Found partial match '${englishColor}' -> '${frenchColor}'`);
      return frenchColor;
    }
  }
  
  // Si toujours pas de correspondance, chercher le mot le plus proche dans le texte
  const words = cleanColor.split(/\s+/);
  for (const word of words) {
    for (const [englishColor, frenchColor] of Object.entries(colorMapping)) {
      if (word === englishColor.toLowerCase()) {
        console.log(`Found word match '${word}' -> '${frenchColor}'`);
        return frenchColor;
      }
    }
  }
  
  // Si on arrive ici, utiliser la couleur brute si elle correspond à une couleur disponible
  for (const availableColor of availableColors) {
    if (cleanColor === availableColor) {
      console.log(`Using direct match with available color: ${availableColor}`);
      return availableColor;
    }
  }
  
  // En dernier recours, mapper à une couleur par défaut selon des mots-clés
  if (cleanColor.includes("dark") || cleanColor.includes("black")) {
    return "noir";
  } else if (cleanColor.includes("light") || cleanColor.includes("white")) {
    return "blanc";
  } else if (cleanColor.includes("red") || cleanColor.includes("crimson") || cleanColor.includes("scarlet")) {
    return "rouge";
  } else if (cleanColor.includes("blue") || cleanColor.includes("navy") || cleanColor.includes("azure")) {
    return "bleu";
  } else if (cleanColor.includes("green")) {
    return "vert";
  } else if (cleanColor.includes("yellow") || cleanColor.includes("gold")) {
    return "jaune";
  }
  
  console.log("No mapping found, returning default color 'rouge'");
  return "rouge";
}

/**
 * Mappe la catégorie de vêtement en anglais vers son équivalent français
 * @param category Catégorie en anglais
 * @returns Catégorie en français
 */
export function mapToFrenchCategory(category: string): string {
  // Nettoyage de la catégorie
  const cleanCategory = category.toLowerCase().trim();
  
  const categoryMapping: Record<string, string> = {
    'shirt': 'Chemise',
    't-shirt': 'T-shirt',
    'tshirt': 'T-shirt',
    't shirt': 'T-shirt',
    'pants': 'Pantalon',
    'jeans': 'Jeans',
    'jean': 'Jeans',
    'dress': 'Robe',
    'skirt': 'Jupe',
    'jacket': 'Veste',
    'coat': 'Manteau',
    'sweater': 'Pull',
    'hoodie': 'Sweat',
    'sweatshirt': 'Sweat',
    'shoes': 'Chaussures',
    'boots': 'Bottes',
    'hat': 'Chapeau',
    'socks': 'Chaussettes',
    'shorts': 'Short',
    'top': 'Haut',
    'blouse': 'Blouse',
    'suit': 'Costume',
    'blazer': 'Blazer',
    'vest': 'Gilet',
    'underwear': 'Sous-vêtement',
    'lingerie': 'Lingerie',
    'swimwear': 'Maillot de bain',
    'scarf': 'Écharpe',
    'gloves': 'Gants',
    'belt': 'Ceinture',
    'tie': 'Cravate',
    'bag': 'Sac',
    'jewelry': 'Bijou',
    'polo': 'Polo',
    'polo shirt': 'Polo',
    'tank': 'Débardeur',
    'tank top': 'Débardeur',
    'cardigan': 'Cardigan',
    'leggings': 'Legging'
  };

  // Trouver une correspondance exacte
  if (categoryMapping[cleanCategory]) {
    return categoryMapping[cleanCategory];
  }
  
  // Chercher une correspondance partielle
  for (const [englishCategory, frenchCategory] of Object.entries(categoryMapping)) {
    if (cleanCategory.includes(englishCategory)) {
      return frenchCategory;
    }
  }
  
  // Si aucune correspondance n'est trouvée, formater et retourner la catégorie originale
  return category.charAt(0).toUpperCase() + category.slice(1);
}


/**
 * Utilities pour normaliser les couleurs détectées
 */

/**
 * Normalise la couleur détectée selon un mapping prédéfini
 * @param color Couleur détectée
 * @returns Couleur normalisée
 */
export function normalizeColor(color: string): string {
  // Normalisation des couleurs en français
  const colorMapping: Record<string, string> = {
    // Couleurs basiques
    "bleu": "bleu",
    "rouge": "rouge",
    "vert": "vert", 
    "jaune": "jaune",
    "noir": "noir",
    "blanc": "blanc",
    "gris": "gris",
    "violet": "violet",
    "rose": "rose",
    "orange": "orange",
    "marron": "marron",
    "beige": "beige",
    // Traductions anglais -> français
    "blue": "bleu",
    "red": "rouge",
    "green": "vert",
    "yellow": "jaune",
    "black": "noir", 
    "white": "blanc",
    "gray": "gris",
    "grey": "gris",
    "purple": "violet",
    "pink": "rose",
    "brown": "marron",
    // Nuances de bleu
    "navy": "bleu",
    "azure": "bleu",
    "cyan": "bleu",
    "teal": "bleu",
    "turquoise": "bleu",
    "marine": "bleu",
    "bleu marine": "bleu",
    "bleu clair": "bleu",
    "bleu foncé": "bleu",
    "sky blue": "bleu",
    "light blue": "bleu",
    "dark blue": "bleu"
  };
  
  if (!color) return "bleu"; // Valeur par défaut
  
  const normalizedColor = colorMapping[color.toLowerCase().trim()] || color;
  console.log("Normalized color:", normalizedColor);
  
  return normalizedColor;
}

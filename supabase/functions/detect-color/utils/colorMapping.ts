
// Correspondance entre les couleurs anglaises et françaises
export const colorMapping: Record<string, string> = {
  // Couleurs basiques
  'white': 'blanc',
  'black': 'noir',
  'gray': 'gris',
  'grey': 'gris',
  
  // Variations de bleu - élargir la détection du bleu
  'blue': 'bleu',
  'navy': 'bleu',
  'navy blue': 'bleu',
  'light blue': 'bleu',
  'dark blue': 'bleu',
  'sky blue': 'bleu',
  'royal blue': 'bleu',
  'teal': 'bleu',
  'denim': 'bleu',
  'indigo': 'bleu',
  'turquoise': 'bleu',
  'aqua': 'bleu',
  'cyan': 'bleu',
  'azure': 'bleu',
  'cobalt': 'bleu',
  'sapphire': 'bleu',
  'cerulean': 'bleu',
  'ocean': 'bleu',
  'midnight': 'bleu',
  'midnight blue': 'bleu',
  'steel': 'bleu',
  'steel blue': 'bleu',
  'blue jean': 'bleu',
  'jeans': 'bleu',
  
  // Autres couleurs
  'red': 'rouge',
  'burgundy': 'rouge',
  'maroon': 'rouge',
  'crimson': 'rouge',
  'scarlet': 'rouge',
  'green': 'vert',
  'olive': 'vert',
  'olive green': 'vert',
  'lime': 'vert',
  'dark green': 'vert',
  'light green': 'vert',
  'forest green': 'vert',
  'yellow': 'jaune',
  'gold': 'jaune',
  'mustard': 'jaune',
  'lemon': 'jaune',
  'orange': 'orange',
  'peach': 'orange',
  'coral': 'orange',
  'tangerine': 'orange',
  'purple': 'violet',
  'lavender': 'violet',
  'lilac': 'violet',
  'mauve': 'violet',
  'magenta': 'violet',
  'pink': 'rose',
  'hot pink': 'rose',
  'salmon': 'rose',
  'brown': 'marron',
  'chocolate': 'marron',
  'tan': 'marron',
  'coffee': 'marron',
  'beige': 'beige',
  'cream': 'beige',
  'khaki': 'beige',
  'sand': 'beige',
  'ivory': 'beige',
  'silver': 'gris',
  'charcoal': 'gris',
  'dark grey': 'gris',
  'light grey': 'gris'
};

// Liste des couleurs disponibles dans l'application avec priorité (du plus spécifique au plus général)
export const availableColors = [
  'bleu', 'noir', 'blanc', 'rouge', 'vert', 
  'jaune', 'orange', 'violet', 'rose', 'marron', 'gris', 'beige'
];

// Priorité des couleurs pour la détection (du plus important au moins important)
export const colorPriority = {
  'bleu': 10,
  'noir': 9,
  'blanc': 8,
  'rouge': 7,
  'vert': 6,
  'jaune': 5,
  'orange': 4,
  'violet': 3,
  'rose': 2,
  'marron': 1,
  'gris': 0,
  'beige': 0
};

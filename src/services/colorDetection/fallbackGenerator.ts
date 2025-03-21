
/**
 * Service de génération de valeurs de secours lorsque les services de détection échouent
 */

/**
 * Type pour la fonction de callback des étapes
 */
type StepCallback = (step: string) => void;

/**
 * Génère une couleur et une catégorie aléatoires lorsque la détection échoue
 * @param onStep Callback pour suivre les étapes de traitement
 * @returns Résultats de détection aléatoires
 */
export const generateFallbackResults = (onStep?: StepCallback): {color: string, category: string} => {
  onStep?.("Utilisation du mode de secours avec valeurs aléatoires");
  
  const randomColors = ['bleu', 'rouge', 'vert', 'jaune', 'noir', 'blanc', 'violet', 'orange'];
  const randomCategories = ['T-shirt', 'Pantalon', 'Chemise', 'Robe', 'Jupe', 'Veste'];
  
  const randomColor = randomColors[Math.floor(Math.random() * randomColors.length)];
  const randomCategory = randomCategories[Math.floor(Math.random() * randomCategories.length)];
  
  console.log('Utilisation de valeurs de secours - Couleur:', randomColor, 'Catégorie:', randomCategory);
  
  return {
    color: randomColor,
    category: randomCategory
  };
};


/**
 * Utilities pour construire les prompts pour l'API Google AI
 */

/**
 * Génère un prompt pour l'analyse d'image de vêtement
 * @returns Prompt formaté pour l'API Google AI
 */
export function buildClothingAnalysisPrompt(): string {
  return `
    Observe attentivement cette image de vêtement et réponds à ces questions:
    1. Quelle est la COULEUR PRINCIPALE du vêtement? (un seul mot)
    2. De quelle CATÉGORIE de vêtement s'agit-il? (t-shirt, chemise, pantalon, etc.)
    3. Décris ce vêtement en 1-2 phrases, en mentionnant son style, sa texture et autres caractéristiques notables.
    4. Si tu peux identifier une marque probable, indique-la. Sinon, réponds "Inconnue".
    5. Ce vêtement est-il adapté à la pluie? Réponds "Oui" ou "Non".
    
    Format de ta réponse (EXACTEMENT):
    COULEUR: [couleur]
    CATÉGORIE: [catégorie]
    DESCRIPTION: [description]
    MARQUE: [marque]
    ADAPTÉ PLUIE: [Oui/Non]
    
    Sois très précis et réponds UNIQUEMENT dans ce format.
    `;
}

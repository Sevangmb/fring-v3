
/**
 * Utilities pour analyser les réponses de l'API Google AI
 */

/**
 * Extrait les informations du vêtement à partir de la réponse textuelle de l'API
 * @param generatedText Texte généré par l'API
 * @returns Informations structurées (couleur, catégorie, description, marque)
 */
export function parseAIResponse(generatedText: string): {
  color: string | null;
  category: string | null;
  description: string | null;
  brand: string | null;
} {
  if (!generatedText) {
    console.error("Empty response from AI");
    return { color: null, category: null, description: null, brand: null };
  }
  
  const lowerText = generatedText.toLowerCase();
  console.log("Parsing AI response:", lowerText);
  
  // Extraire la couleur avec regex
  const colorMatch = lowerText.match(/couleur:\s*([a-zéèêëàâäôöùûüç]+)/i);
  const color = colorMatch?.[1]?.trim() || null;
  
  // Extraire la catégorie avec regex
  const categoryMatch = lowerText.match(/catégorie:\s*([a-zéèêëàâäôöùûüç\s-]+)/i);
  const category = categoryMatch?.[1]?.trim() || null;
  
  // Extraire la description avec regex
  const descriptionMatch = lowerText.match(/description:\s*(.*?)(?=\n|$)/is);
  const description = descriptionMatch?.[1]?.trim() || null;
  
  // Extraire la marque avec regex
  const brandMatch = lowerText.match(/marque:\s*([a-zéèêëàâäôöùûüç\s-]+)/i);
  let brand = brandMatch?.[1]?.trim() || null;
  
  // Ne pas retourner "inconnue" comme marque
  if (brand && (brand.toLowerCase() === "inconnue" || brand.toLowerCase() === "unknown" || brand.toLowerCase() === "inconnu")) {
    brand = null;
  }
  
  console.log("Extracted data:", { color, category, description, brand });
  
  return { color, category, description, brand };
}


/**
 * Analyse la réponse de l'API pour extraire les informations structurées
 * @param response Réponse textuelle de l'API
 * @returns Informations structurées sur le vêtement
 */
export function parseAIResponse(response: string): {
  color: string;
  category: string;
  description?: string;
  brand?: string;
  rainSuitable?: boolean;
} {
  try {
    console.log("Parsing AI response:", response);
    
    // Extraire la couleur
    const colorMatch = response.match(/COULEUR:\s*(.*)/i);
    const color = colorMatch ? colorMatch[1].trim() : "";
    
    // Extraire la catégorie
    const categoryMatch = response.match(/CATÉGORIE:\s*(.*)/i) || 
                          response.match(/CATEGORIE:\s*(.*)/i);
    const category = categoryMatch ? categoryMatch[1].trim() : "";
    
    // Extraire la description
    const descriptionMatch = response.match(/DESCRIPTION:\s*(.*)/i);
    const description = descriptionMatch ? descriptionMatch[1].trim() : undefined;
    
    // Extraire la marque
    const brandMatch = response.match(/MARQUE:\s*(.*)/i);
    const brand = brandMatch && !brandMatch[1].includes("Inconnue") ? 
                 brandMatch[1].trim() : undefined;
    
    // Extraire si le vêtement est adapté à la pluie
    const rainMatch = response.match(/ADAPTÉ PLUIE:\s*(.*)/i) || 
                      response.match(/ADAPTE PLUIE:\s*(.*)/i);
    const rainSuitable = rainMatch ? 
                        rainMatch[1].trim().toLowerCase() === "oui" : undefined;
    
    console.log("Parsed information:", { color, category, description, brand, rainSuitable });
    
    return { color, category, description, brand, rainSuitable };
  } catch (error) {
    console.error("Error parsing AI response:", error);
    return { color: "", category: "" };
  }
}

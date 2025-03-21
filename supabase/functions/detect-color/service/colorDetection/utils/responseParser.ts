
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
  temperature?: string;
  weatherType?: string;
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
    
    // Extraire la température
    const temperatureMatch = response.match(/TEMPÉRATURE:\s*(.*)/i) ||
                             response.match(/TEMPERATURE:\s*(.*)/i);
    let temperature = temperatureMatch ? temperatureMatch[1].trim().toLowerCase() : undefined;
    
    // Normaliser la température
    if (temperature) {
      if (temperature.includes("froid")) {
        temperature = "froid";
      } else if (temperature.includes("chaud")) {
        temperature = "chaud";
      } else if (temperature.includes("tempéré") || temperature.includes("tempere")) {
        temperature = "tempere";
      } else {
        // Par défaut si la valeur n'est pas reconnue
        temperature = "tempere";
      }
    }
    
    // Extraire le type de météo
    const weatherTypeMatch = response.match(/TYPE DE MÉTÉO:\s*(.*)/i) ||
                             response.match(/TYPE DE METEO:\s*(.*)/i);
    let weatherType = weatherTypeMatch ? weatherTypeMatch[1].trim().toLowerCase() : undefined;
    
    // Normaliser le type de météo
    if (weatherType) {
      if (weatherType.includes("pluie")) {
        weatherType = "pluie";
      } else if (weatherType.includes("neige")) {
        weatherType = "neige";
      } else if (weatherType.includes("normal")) {
        weatherType = "normal";
      } else {
        // Par défaut si la valeur n'est pas reconnue
        weatherType = "normal";
      }
    }
    
    console.log("Parsed information:", { 
      color, 
      category, 
      description, 
      brand, 
      rainSuitable,
      temperature,
      weatherType 
    });
    
    return { 
      color, 
      category, 
      description, 
      brand, 
      rainSuitable,
      temperature,
      weatherType
    };
  } catch (error) {
    console.error("Error parsing AI response:", error);
    return { color: "", category: "" };
  }
}

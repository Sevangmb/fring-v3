
/**
 * Utilities pour extraire les données structurées des réponses de Google AI
 */

/**
 * Extrait les informations du vêtement depuis la réponse de l'API Google AI
 * @param responseText Texte de réponse de l'API Google AI
 * @returns Objet contenant les informations extraites
 */
export function parseAIResponse(responseText: string): {
  color?: string,
  category?: string,
  description?: string,
  brand?: string,
  rainSuitable?: boolean,
  temperature?: string,
  weatherType?: string
} {
  if (!responseText) return {}; // Vérification de base
  
  console.log("Parsing AI response:", responseText);
  
  // Object pour stocker les résultats extraits
  const result: {
    color?: string,
    category?: string,
    description?: string,
    brand?: string,
    rainSuitable?: boolean,
    temperature?: string,
    weatherType?: string
  } = {};
  
  // Extraire la couleur
  const colorMatch = responseText.match(/COULEUR:?\s*([^\n]+)/i);
  if (colorMatch && colorMatch[1]) {
    result.color = colorMatch[1].trim();
    console.log("Extracted color:", result.color);
  }
  
  // Extraire la catégorie
  const categoryMatch = responseText.match(/CATÉGORIE:?\s*([^\n]+)/i);
  if (categoryMatch && categoryMatch[1]) {
    result.category = categoryMatch[1].trim();
    console.log("Extracted category:", result.category);
    
    // Traitement spécial pour les chaussures/tongs
    if (result.category.toLowerCase().includes('tong') || 
        result.category.toLowerCase().includes('sandale') || 
        result.category.toLowerCase().includes('chaussure')) {
      result.category = 'Chaussures';
    }
  }
  
  // Extraire la description
  const descriptionMatch = responseText.match(/DESCRIPTION:?\s*([^\n]+)/i);
  if (descriptionMatch && descriptionMatch[1]) {
    result.description = descriptionMatch[1].trim();
    console.log("Extracted description:", result.description);
    
    // Si "tong" est dans la description mais pas la catégorie, on modifie la catégorie
    if (result.description.toLowerCase().includes('tong') && 
        (!result.category || !result.category.toLowerCase().includes('chaussure'))) {
      result.category = 'Chaussures';
    }
    
    // Si "bleu" est dans la description mais pas la couleur, on modifie la couleur
    if (result.description.toLowerCase().includes('bleu') && 
        (!result.color || !result.color.toLowerCase().includes('bleu'))) {
      result.color = 'bleu';
    }
  }
  
  // Extraire la marque
  const brandMatch = responseText.match(/MARQUE:?\s*([^\n]+)/i);
  if (brandMatch && brandMatch[1]) {
    result.brand = brandMatch[1].trim();
    console.log("Extracted brand:", result.brand);
  }
  
  // Extraire la température
  const temperatureMatch = responseText.match(/TEMPÉRATURE:?\s*([^\n]+)/i);
  if (temperatureMatch && temperatureMatch[1]) {
    const temperatureValue = temperatureMatch[1].trim().toLowerCase();
    
    // Normaliser les valeurs de température
    if (temperatureValue.includes('chaud')) {
      result.temperature = 'chaud';
    } else if (temperatureValue.includes('froid')) {
      result.temperature = 'froid';
    } else {
      result.temperature = 'tempere';
    }
    
    console.log("Extracted temperature:", result.temperature);
  }
  
  // Extraire le type de météo
  const weatherMatch = responseText.match(/TYPE DE MÉTÉO:?\s*([^\n]+)/i);
  if (weatherMatch && weatherMatch[1]) {
    const weatherValue = weatherMatch[1].trim().toLowerCase();
    
    // Normaliser les valeurs de météo
    if (weatherValue.includes('pluie')) {
      result.weatherType = 'pluie';
      result.rainSuitable = true;
    } else if (weatherValue.includes('neige')) {
      result.weatherType = 'neige';
      result.rainSuitable = false;
    } else {
      result.weatherType = 'normal';
      result.rainSuitable = false;
    }
    
    console.log("Extracted weather type:", result.weatherType);
  }
  
  // Spécial pour les tongs - généralement pour temps chaud et normal
  if ((result.category?.toLowerCase().includes('tong') || 
      result.description?.toLowerCase().includes('tong')) && 
      !result.temperature) {
    result.temperature = 'chaud';
    console.log("Setting default temperature for sandals/flip-flops to 'chaud'");
  }
  
  return result;
}

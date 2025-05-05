
/**
 * Génère un message adapté aux conditions météo et à la tenue suggérée
 */
export const generateOutfitMessage = (
  temperature: number,
  weatherDescription: string,
  isRaining: boolean
): string => {
  // Messages pour la pluie
  if (isRaining || 
      weatherDescription.toLowerCase().includes('pluie') || 
      weatherDescription.toLowerCase().includes('pluvieux')) {
    
    if (temperature < 5) {
      return "Il pleut et il fait très froid. Portez des vêtements chauds et imperméables, avec des bottes étanches.";
    } else if (temperature < 15) {
      return "Temps pluvieux et frais aujourd'hui. Une veste imperméable et des chaussures adaptées vous garderont au sec.";
    } else if (temperature < 22) {
      return "Pluie avec des températures modérées. Privilégiez les vêtements imperméables mais pas trop chauds.";
    } else {
      return "Pluie chaude aujourd'hui. Optez pour des vêtements légers mais imperméables pour rester au sec sans avoir trop chaud.";
    }
  }
  
  // Messages pour la neige
  if (weatherDescription.toLowerCase().includes('neige')) {
    return "Il neige aujourd'hui ! Portez des vêtements chauds, imperméables et de bonnes chaussures antidérapantes.";
  }
  
  // Messages par température (temps sec)
  if (temperature < 5) {
    return "Il fait très froid aujourd'hui. Portez plusieurs couches de vêtements chauds et n'oubliez pas vos gants et bonnet.";
  } else if (temperature < 12) {
    return "Temps frais aujourd'hui. Un bon pull et une veste vous tiendront au chaud.";
  } else if (temperature < 20) {
    return "Température agréable aujourd'hui. Une tenue légère avec une petite veste sera parfaite.";
  } else if (temperature < 25) {
    return "Belle journée ensoleillée. Des vêtements légers seront confortables pour aujourd'hui.";
  } else if (temperature < 30) {
    return "Il fait chaud aujourd'hui. Privilégiez les vêtements légers et respirants.";
  } else {
    return "Attention, fortes chaleurs ! Portez des vêtements très légers, clairs, et n'oubliez pas de vous hydrater.";
  }
};

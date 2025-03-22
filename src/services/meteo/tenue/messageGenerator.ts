
/**
 * Génère un message adapté à la météo pour la suggestion de tenue
 */
export const generateOutfitMessage = (temperature: number, weatherDescription: string, isRaining: boolean): string => {
  // Détermine le type de température
  let temperatureMessage = "";
  if (temperature < 5) {
    temperatureMessage = "Il fait très froid aujourd'hui";
  } else if (temperature < 12) {
    temperatureMessage = "Il fait assez frais aujourd'hui";
  } else if (temperature < 20) {
    temperatureMessage = "La température est modérée aujourd'hui";
  } else if (temperature < 28) {
    temperatureMessage = "Il fait chaud aujourd'hui";
  } else {
    temperatureMessage = "Il fait très chaud aujourd'hui";
  }
  
  // Ajoute des informations sur la pluie si nécessaire
  let rainMessage = "";
  if (isRaining) {
    rainMessage = "et il pleut. Voici une tenue adaptée à ces conditions.";
  } else if (weatherDescription.toLowerCase().includes("nuage")) {
    rainMessage = "avec un temps nuageux. Voici une tenue adaptée à ces conditions.";
  } else if (weatherDescription.toLowerCase().includes("soleil") || weatherDescription.toLowerCase().includes("ensoleill")) {
    rainMessage = "avec un temps ensoleillé. Voici une tenue adaptée à ces conditions.";
  } else {
    rainMessage = `. ${weatherDescription}. Voici une tenue adaptée à ces conditions.`;
  }
  
  return `${temperatureMessage} (${temperature}°C) ${rainMessage}`;
};

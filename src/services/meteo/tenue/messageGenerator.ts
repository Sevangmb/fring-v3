
/**
 * Génère un message d'accompagnement pour la suggestion de tenue
 */
export const generateOutfitMessage = (
  temperature: number,
  weatherDescription: string,
  isRaining: boolean
): string => {
  // Adapter le message en fonction des conditions météo
  let message = '';
  
  // Message selon la température
  if (temperature < 5) {
    message = 'Il fait très froid aujourd\'hui ! Voici une tenue d\'hiver qui vous tiendra bien au chaud.';
  } else if (temperature < 15) {
    message = 'Le temps est frais, cette tenue d\'hiver vous protègera du froid.';
  } else if (temperature < 20) {
    message = 'Température douce aujourd\'hui, voici une tenue mi-saison confortable.';
  } else if (temperature < 25) {
    message = 'Il fait doux aujourd\'hui, voici une tenue d\'été adaptée à cette belle journée !';
  } else {
    message = 'Il fait chaud ! Cette tenue d\'été légère sera idéale pour affronter cette chaleur.';
  }
  
  // Ajouter une mention sur la pluie ou le beau temps
  if (isRaining) {
    message += ' N\'oubliez pas que des précipitations sont prévues, cette tenue vous gardera au sec.';
  } else if (weatherDescription.toLowerCase().includes('soleil') || 
             weatherDescription.toLowerCase().includes('clair') || 
             weatherDescription.toLowerCase().includes('ensoleillé')) {
    message += ' Profitez du soleil avec cette tenue !';
  } else if (weatherDescription.toLowerCase().includes('nuage') || 
             weatherDescription.toLowerCase().includes('couvert')) {
    message += ' Le temps est nuageux, mais cette tenue reste parfaitement adaptée.';
  }
  
  return message;
};

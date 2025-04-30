
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
    message = 'Il fait très froid aujourd\'hui ! Voici une tenue qui vous tiendra bien au chaud.';
  } else if (temperature < 10) {
    message = 'Le temps est frais, cette tenue vous protègera du froid.';
  } else if (temperature < 15) {
    message = 'Température fraîche aujourd\'hui, voici une tenue confortable.';
  } else if (temperature < 20) {
    message = 'Le temps est agréable, cette tenue sera parfaite pour aujourd\'hui.';
  } else if (temperature < 25) {
    message = 'Il fait doux aujourd\'hui, voici une tenue adaptée à cette belle journée !';
  } else if (temperature < 30) {
    message = 'Il fait chaud ! Cette tenue légère sera idéale.';
  } else {
    message = 'Canicule ! Voici une tenue très légère pour affronter cette chaleur.';
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
    message += ' Le temps est nuageux, mais cette tenue reste adaptée.';
  }
  
  return message;
};

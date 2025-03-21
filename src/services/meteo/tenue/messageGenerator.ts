
/**
 * Génère un message de suggestion de tenue selon la météo
 */
export const generateOutfitMessage = (temperature: number, description: string, isRaining: boolean = false): string => {
  const baseMessage = isRaining 
    ? `Il pleut avec ${description} et il fait ${temperature}°C. `
    : `Il fait ${temperature}°C avec ${description}. `;

  if (isRaining) {
    if (temperature <= 5) {
      return `${baseMessage}Portez des vêtements chauds et imperméables, avec de bonnes chaussures étanches pour garder vos pieds au sec.`;
    } else if (temperature <= 15) {
      return `${baseMessage}Un imperméable ou une veste résistante à l'eau est recommandé, ainsi que des chaussures qui ne craignent pas l'eau. Évitez les tissus qui absorbent l'humidité.`;
    } else {
      return `${baseMessage}Optez pour une tenue légère mais imperméable ou déperlante. Privilégiez des chaussures fermées et évitez les matières comme le daim ou la toile.`;
    }
  } else {
    if (temperature <= 5) {
      return `${baseMessage}Portez plusieurs couches et n'oubliez pas un manteau chaud et des gants.`;
    } else if (temperature <= 10) {
      return `${baseMessage}Un pull épais et une veste seraient appropriés.`;
    } else if (temperature <= 15) {
      return `${baseMessage}Une veste légère ou un pull fin serait idéal.`;
    } else if (temperature <= 22) {
      return `${baseMessage}Un t-shirt et une veste légère suffiront.`;
    } else if (temperature <= 27) {
      return `${baseMessage}Des vêtements légers sont recommandés.`;
    } else {
      return `${baseMessage}Optez pour des vêtements très légers et confortables.`;
    }
  }
};

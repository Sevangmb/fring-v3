
/**
 * Retire les caractères diacritiques d'une chaîne
 * (accents, cédilles, etc.)
 * @param str Chaîne à normaliser
 * @returns Chaîne sans accents
 */
export const removeDiacritics = (str: string): string => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

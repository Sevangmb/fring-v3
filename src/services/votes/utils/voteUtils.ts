
/**
 * Vérifie si un ID d'entité est valide (existe et est un nombre positif)
 */
export const isValidEntityId = (id: number | undefined): boolean => {
  return id !== undefined && id !== null && !isNaN(id) && id > 0;
};

/**
 * Vérifie la connexion Internet
 */
export const isOnline = (): boolean => {
  return navigator.onLine;
};

/**
 * Vérifie si la valeur de vote est valide
 */
export const isValidVote = (vote: any): boolean => {
  return vote === 'up' || vote === 'down' || vote === null;
};

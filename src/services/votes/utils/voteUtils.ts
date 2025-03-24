
/**
 * Vérifier si un ID d'entité est valide
 */
export const isValidEntityId = (entityId: number | null | undefined): boolean => {
  if (entityId === null || entityId === undefined) {
    return false;
  }
  
  if (isNaN(entityId) || entityId <= 0) {
    return false;
  }
  
  return true;
};

/**
 * Vérifier si l'application est en ligne
 */
export const isOnline = (): boolean => {
  return navigator.onLine;
};

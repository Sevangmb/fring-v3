
/**
 * Check if an entity ID is valid
 */
export const isValidEntityId = (id: number | undefined): boolean => {
  return id !== undefined && id !== null && !isNaN(id) && id > 0;
};

/**
 * Check if the browser is online
 */
export const isOnline = (): boolean => {
  return navigator.onLine;
};

/**
 * Get table info for each entity type
 */
export const getEntityTableInfo = (entityType: string): { tableName: string; idField: string } => {
  switch (entityType) {
    case 'vetement':
      return { tableName: 'vetement_votes', idField: 'vetement_id' };
    case 'tenue':
      return { tableName: 'tenue_votes', idField: 'tenue_id' };
    case 'defi':
      return { tableName: 'defi_votes', idField: 'defi_id' };
    default:
      throw new Error(`Type d'entité non supporté: ${entityType}`);
  }
};

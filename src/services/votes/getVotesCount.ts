
import { getVoteCount } from './getVoteCount';
import { EntityType } from './types';

/**
 * Récupère le nombre de votes pour une entité
 * @param entityType Type de l'entité ('ensemble' ou 'defi')
 * @param entityId ID de l'entité
 * @returns Objet contenant le nombre de votes positifs et négatifs
 */
export const getVotesCount = async (
  entityType: EntityType,
  entityId: number
) => {
  return getVoteCount(entityType, entityId);
};

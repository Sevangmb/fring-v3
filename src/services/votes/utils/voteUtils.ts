
import { VotesCount } from "../types";

/**
 * Calculer le score (votes positifs - votes négatifs)
 */
export const calculateScore = (votes: VotesCount): number => {
  return votes.up - votes.down;
};

/**
 * Vérifier si l'ID d'entité est valide
 */
export const isValidEntityId = (entityId: number | undefined): boolean => {
  return entityId !== undefined && entityId !== null && !isNaN(entityId);
};

/**
 * Vérifier si l'utilisateur est connecté à Internet
 */
export const isOnline = (): boolean => {
  return navigator.onLine;
};

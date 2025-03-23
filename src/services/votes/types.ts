
export type VoteType = 'up' | 'down' | null;

export type EntityType = 'vetement' | 'ensemble' | 'defi';

export interface VoteOptions {
  tableName: string; // La table où les votes sont stockés
  userIdField?: string; // Champ faisant référence à l'ID utilisateur (défaut: "user_id")
  entityIdField?: string; // Champ faisant référence à l'ID de l'entité (défaut: type d'entité + "_id")
  voteField?: string; // Champ stockant la valeur du vote (défaut: "vote")
}

export interface VotesCount {
  up: number;
  down: number;
}

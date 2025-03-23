
export type VoteType = 'up' | 'down' | null;

export type EntityType = 'vetement' | 'ensemble' | 'defi';

export interface VoteOptions {
  tableName: string; // The table where votes are stored
  userIdField?: string; // Field that references the user ID (default: "user_id")
  entityIdField?: string; // Field that references the entity ID (default: entity type + "_id")
  voteField?: string; // Field that stores the vote value (default: "vote")
}

export interface VotesCount {
  up: number;
  down: number;
}

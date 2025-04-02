
export interface Defi {
  id: number;
  titre: string;
  description: string;
  date_debut: string;
  date_fin: string;
  user_id: string | null;
  participants_count: number;
  status: 'current' | 'upcoming' | 'past';
  created_at: string;
  ensemble_id?: number;
}

export type VoteType = 'up' | 'down' | null;

export interface DefiFormData {
  titre: string;
  description: string;
  dateDebut: string;
  dateFin: string;
}

export interface DefiVote {
  id: number;
  defi_id: number;
  user_id: string;
  vote: VoteType;
  created_at: string;
}

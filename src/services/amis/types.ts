
// Types for friend-related functionality
export interface Ami {
  id: number;
  user_id: string;
  ami_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  // Données supplémentaires pour l'affichage
  email?: string;
}

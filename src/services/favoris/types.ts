
export interface Favori {
  id: string;
  user_id: string;
  type_favori: 'utilisateur' | 'vetement' | 'ensemble';
  element_id: string;
  created_at: string;
}

export interface FavoriWithDetails extends Favori {
  details?: any; // Les détails varient selon le type de favori
  nom?: string;  // Nom commun à tous les types
}

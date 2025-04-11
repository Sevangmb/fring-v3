
/**
 * Interface pour un ensemble (tenue)
 */
export interface Ensemble {
  id: number;
  nom: string;
  description?: string;
  occasion?: string;
  saison?: string;
  created_at: string;
  user_id?: string;
  vetements: any[];
  image_url?: string;
}

/**
 * Interface pour un vêtement dans un ensemble
 */
export interface VetementInEnsemble {
  id: number;
  nom: string;
  description?: string;
  image_url?: string;
  couleur?: string;
  marque?: string;
  taille?: string;
  categorie_id: number;
}

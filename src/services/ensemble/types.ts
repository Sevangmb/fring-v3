
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
  email?: string; // Ajout de l'email pour EnsembleCard
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

/**
 * Interface pour les paramètres de création d'un ensemble
 */
export interface EnsembleCreateParams {
  nom: string;
  description?: string;
  occasion?: string;
  saison?: string;
  vetements: { 
    id: number; 
    type?: string; // Ajout de la propriété type comme optionnelle
  }[];
}

/**
 * Interface pour les paramètres de mise à jour d'un ensemble
 */
export interface EnsembleUpdateParams {
  id: number;
  nom?: string;
  description?: string;
  occasion?: string;
  saison?: string;
  vetements?: { 
    id: number;
    type?: string; // Ajout de la propriété type comme optionnelle
  }[];
}


// Define the common types used across vetement services
export interface Vetement {
  id: number;
  nom: string;
  categorie_id: number;
  couleur: string;
  taille: string;
  description?: string;
  marque?: string;
  image_url?: string;
  created_at?: string;
  user_id?: string;
  owner_email?: string;
  temperature?: "froid" | "tempere" | "chaud";
  weatherType?: "pluie" | "neige" | "normal";
  // Nouveaux champs pour la vente
  prix_achat?: number;
  prix_vente?: number;
  a_vendre?: boolean;
  lieu_vente?: string;
  infos_vente?: string;
  promo_pourcentage?: number;
  etat?: "neuf" | "très bon" | "bon" | "moyen" | "usé";
  disponibilite?: "disponible" | "réservé" | "vendu";
}

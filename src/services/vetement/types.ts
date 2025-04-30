
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
  a_vendre?: boolean;
  prix_vente?: number;
  prix_achat?: number;
  promo_pourcentage?: number;
  disponibilite?: string;
  etat?: string;
  lieu_vente?: string;
  infos_vente?: string;
  temperature?: string;
  weather_type?: string;
  owner_email?: string; // Added this property
}


// Define the common types used across vetement services
export interface Vetement {
  id: number;
  nom: string;
  categorie: string;
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
}

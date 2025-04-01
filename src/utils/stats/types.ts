
import { Vetement } from "@/services/vetement/types";

/**
 * Interface for vetement with categories relationship
 */
export interface VetementWithCategories {
  id: number;
  nom: string;
  couleur: string;
  taille: string;
  description?: string;
  marque?: string;
  image_url?: string;
  created_at?: string;
  user_id?: string;
  categories?: {
    id: number;
    nom: string;
  }[];
}

/**
 * Interface for dashboard statistics
 */
export interface DashboardStats {
  totalVetements: number;
  totalTenues: number;
  totalAmis: number;
  categoriesDistribution: { name: string; count: number }[];
  couleursDistribution: { name: string; count: number }[];
  marquesDistribution: { name: string; count: number }[];
  recentActivity: {
    type: string;
    date: string;
    description: string;
  }[];
}

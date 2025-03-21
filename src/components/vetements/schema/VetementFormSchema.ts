
import { z } from "zod";

// Schéma de validation pour le formulaire
export const vetementSchema = z.object({
  nom: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  categorie: z.string().min(1, { message: "Veuillez sélectionner une catégorie" }),
  couleur: z.string().min(1, { message: "Veuillez choisir une couleur" }),
  taille: z.string().min(1, { message: "Veuillez sélectionner une taille" }),
  description: z.string().optional(),
  marque: z.string().optional(),
});

export type VetementFormValues = z.infer<typeof vetementSchema>;

// Type pour les catégories
export interface Categorie {
  id: number;
  nom: string;
  description: string | null;
}

// Type pour les marques
export interface Marque {
  id: number;
  nom: string;
  site_web: string | null;
  logo_url: string | null;
}

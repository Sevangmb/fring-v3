
import { z } from "zod";

// Define categories
export interface Categorie {
  id: string;
  nom: string;
}

// Température options
export const temperatureOptions = [
  { value: "froid", label: "Froid" },
  { value: "tempere", label: "Tempéré" },
  { value: "chaud", label: "Chaud" },
] as const;

export type TemperatureOption = typeof temperatureOptions[number]["value"];

// Schema for vetement form
export const vetementFormSchema = z.object({
  nom: z.string().min(1, "Le nom est requis"),
  categorie: z.string().min(1, "La catégorie est requise"),
  couleur: z.string().min(1, "La couleur est requise"),
  taille: z.string().min(1, "La taille est requise"),
  marque: z.string().optional(),
  description: z.string().optional(),
  temperature: z.enum(["froid", "tempere", "chaud"]).optional(),
});

// Type for form values
export type VetementFormValues = z.infer<typeof vetementFormSchema>;

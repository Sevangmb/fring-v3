
import { z } from "zod";

// Define categories
export interface Categorie {
  id: string | number;
  nom: string;
  description?: string | null;
}

// Define marques
export interface Marque {
  id: number;
  nom: string;
  site_web?: string | null;
  logo_url?: string | null;
}

// Température options
export const temperatureOptions = [
  { value: "froid", label: "Froid" },
  { value: "tempere", label: "Tempéré" },
  { value: "chaud", label: "Chaud" },
] as const;

export type TemperatureOption = typeof temperatureOptions[number]["value"];

// Weather type options
export const weatherTypeOptions = [
  { value: "normal", label: "Normal" },
  { value: "pluie", label: "Pluie" },
  { value: "neige", label: "Neige" },
] as const;

export type WeatherTypeOption = typeof weatherTypeOptions[number]["value"];

// Schema for vetement form
export const vetementFormSchema = z.object({
  nom: z.string().min(1, "Le nom est requis"),
  categorie_id: z.number({
    required_error: "La catégorie est requise",
    invalid_type_error: "La catégorie doit être un nombre",
  }),
  couleur: z.string().min(1, "La couleur est requise"),
  taille: z.string().min(1, "La taille est requise"),
  marque: z.string().optional(),
  description: z.string().optional(),
  temperature: z.enum(["froid", "tempere", "chaud"]).optional(),
  weatherType: z.enum(["normal", "pluie", "neige"]).optional(),
  image_url: z.string().optional(),
  // Nouveaux champs pour l'étiquette
  composition: z.string().optional(),
  instructions_lavage: z.string().optional(),
  pays_fabrication: z.string().optional(),
  etiquette_image_url: z.string().optional(),
});

// Type for form values
export type VetementFormValues = z.infer<typeof vetementFormSchema>;


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

// État options
export const etatOptions = [
  { value: "neuf", label: "Neuf" },
  { value: "très bon", label: "Très bon" },
  { value: "bon", label: "Bon" },
  { value: "moyen", label: "Moyen" },
  { value: "usé", label: "Usé" },
] as const;

export type EtatOption = typeof etatOptions[number]["value"];

// Disponibilité options
export const disponibiliteOptions = [
  { value: "disponible", label: "Disponible" },
  { value: "réservé", label: "Réservé" },
  { value: "vendu", label: "Vendu" },
] as const;

export type DisponibiliteOption = typeof disponibiliteOptions[number]["value"];

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
  weather_type: z.enum(["normal", "pluie", "neige"]).optional(),
  image_url: z.string().optional(),
  // Nouveaux champs pour la vente
  a_vendre: z.boolean().optional().default(false),
  prix_achat: z.number().optional().nullable(),
  prix_vente: z.number().optional().nullable(),
  lieu_vente: z.string().optional().nullable(),
  infos_vente: z.string().optional().nullable(),
  promo_pourcentage: z.number().min(0).max(100).optional().nullable(),
  etat: z.enum(["neuf", "très bon", "bon", "moyen", "usé"]).optional().nullable(),
  disponibilite: z.enum(["disponible", "réservé", "vendu"]).optional().default("disponible"),
});

// Type for form values
export type VetementFormValues = z.infer<typeof vetementFormSchema>;

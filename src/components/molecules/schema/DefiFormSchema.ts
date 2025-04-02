
import { z } from "zod";

// Schéma de validation pour le formulaire de défi
export const defiFormSchema = z.object({
  titre: z.string().min(5, "Le titre doit contenir au moins 5 caractères"),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
  dateDebut: z.string().refine(val => !!val, "La date de début est requise"),
  dateFin: z.string().refine(val => !!val, "La date de fin est requise")
});

// Type dérivé du schéma
export type DefiFormValues = z.infer<typeof defiFormSchema>;

// Fonction auxiliaire pour valider la logique des dates
export const validateDateRange = (data: DefiFormValues): { success: boolean, error: string | null } => {
  const dateDebut = new Date(data.dateDebut);
  const dateFin = new Date(data.dateFin);
  const today = new Date();
  
  // Réinitialiser les heures pour comparer uniquement les dates
  today.setHours(0, 0, 0, 0);
  
  if (dateDebut < today) {
    return {
      success: false,
      error: "La date de début doit être égale ou postérieure à aujourd'hui"
    };
  }
  
  if (dateFin < dateDebut) {
    return {
      success: false,
      error: "La date de fin doit être postérieure à la date de début"
    };
  }
  
  return { success: true, error: null };
};

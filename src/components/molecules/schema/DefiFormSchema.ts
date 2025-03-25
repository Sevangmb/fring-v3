
import { z } from "zod";

// Validation schema for creating or editing defis
export const defiFormSchema = z.object({
  titre: z
    .string()
    .min(3, { message: "Le titre doit contenir au moins 3 caractères" })
    .max(50, { message: "Le titre ne peut pas dépasser 50 caractères" }),
  description: z
    .string()
    .min(10, { message: "La description doit contenir au moins 10 caractères" })
    .max(200, { message: "La description ne peut pas dépasser 200 caractères" }),
  dateDebut: z
    .string()
    .min(1, { message: "La date de début est requise" }),
  dateFin: z
    .string()
    .min(1, { message: "La date de fin est requise" })
});

// Type for the form values inferred from the schema
export type DefiFormValues = z.infer<typeof defiFormSchema>;

// Validation function that checks if end date is after start date
export const validateDateRange = (data: DefiFormValues): { success: boolean; error?: string } => {
  if (!data.dateDebut || !data.dateFin) {
    return { success: true }; // Let the schema validation handle empty dates
  }
  
  const startDate = new Date(data.dateDebut);
  const endDate = new Date(data.dateFin);
  
  if (endDate <= startDate) {
    return { 
      success: false, 
      error: "La date de fin doit être après la date de début" 
    };
  }
  
  return { success: true };
};

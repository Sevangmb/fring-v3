
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { z } from "zod";

// Type pour les catégories
interface Categorie {
  id: number;
  nom: string;
  description: string | null;
}

// Type pour les marques
interface Marque {
  id: number;
  nom: string;
  site_web: string | null;
  logo_url: string | null;
}

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

interface VetementFormFieldsProps {
  form: UseFormReturn<VetementFormValues>;
  categories: Categorie[];
  marques: Marque[];
  loadingCategories: boolean;
  detectingColor: boolean;
}

const VetementFormFields: React.FC<VetementFormFieldsProps> = ({
  form,
  categories,
  marques,
  loadingCategories,
  detectingColor,
}) => {
  return (
    <>
      {/* Nom */}
      <FormField
        control={form.control}
        name="nom"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nom*</FormLabel>
            <FormControl>
              <Input placeholder="T-shirt blanc" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Ligne: Catégorie et Couleur */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Catégorie */}
        <FormField
          control={form.control}
          name="categorie"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Catégorie*</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                disabled={loadingCategories}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={loadingCategories ? "Chargement..." : "Sélectionner une catégorie"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {loadingCategories ? (
                    <div className="flex items-center justify-center p-2">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      <span>Chargement...</span>
                    </div>
                  ) : (
                    categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.nom}>
                        {cat.nom}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Couleur */}
        <FormField
          control={form.control}
          name="couleur"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Couleur*</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={detectingColor ? "Détection en cours..." : "Sélectionner une couleur"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="blanc">Blanc</SelectItem>
                  <SelectItem value="noir">Noir</SelectItem>
                  <SelectItem value="gris">Gris</SelectItem>
                  <SelectItem value="bleu">Bleu</SelectItem>
                  <SelectItem value="rouge">Rouge</SelectItem>
                  <SelectItem value="vert">Vert</SelectItem>
                  <SelectItem value="jaune">Jaune</SelectItem>
                  <SelectItem value="orange">Orange</SelectItem>
                  <SelectItem value="violet">Violet</SelectItem>
                  <SelectItem value="rose">Rose</SelectItem>
                  <SelectItem value="marron">Marron</SelectItem>
                  <SelectItem value="beige">Beige</SelectItem>
                  <SelectItem value="multicolore">Multicolore</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      {/* Ligne: Taille et Marque */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Taille */}
        <FormField
          control={form.control}
          name="taille"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Taille*</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une taille" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="XS">XS</SelectItem>
                  <SelectItem value="S">S</SelectItem>
                  <SelectItem value="M">M</SelectItem>
                  <SelectItem value="L">L</SelectItem>
                  <SelectItem value="XL">XL</SelectItem>
                  <SelectItem value="XXL">XXL</SelectItem>
                  <SelectItem value="36">36</SelectItem>
                  <SelectItem value="38">38</SelectItem>
                  <SelectItem value="40">40</SelectItem>
                  <SelectItem value="42">42</SelectItem>
                  <SelectItem value="44">44</SelectItem>
                  <SelectItem value="46">46</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Marque */}
        <FormField
          control={form.control}
          name="marque"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Marque</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une marque (optionnel)" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {marques.length > 0 ? (
                    marques.map((marque) => (
                      <SelectItem key={marque.id} value={marque.nom}>
                        {marque.nom}
                      </SelectItem>
                    ))
                  ) : (
                    <>
                      <SelectItem value="Nike">Nike</SelectItem>
                      <SelectItem value="Adidas">Adidas</SelectItem>
                      <SelectItem value="Zara">Zara</SelectItem>
                      <SelectItem value="H&M">H&M</SelectItem>
                      <SelectItem value="Levi's">Levi's</SelectItem>
                      <SelectItem value="Uniqlo">Uniqlo</SelectItem>
                      <SelectItem value="Gap">Gap</SelectItem>
                      <SelectItem value="Autre">Autre</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
              <FormDescription>Optionnel</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      {/* Description */}
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Détails supplémentaires sur votre vêtement..." 
                {...field}
                rows={4}
              />
            </FormControl>
            <FormDescription>Optionnel</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default VetementFormFields;

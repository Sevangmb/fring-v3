import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/templates/Layout";
import { Heading, Text } from "@/components/atoms/Typography";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Shirt, ArrowLeft, ImagePlus, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { addVetement } from "@/services/supabaseService";

// Définir le schéma de validation pour le formulaire d'ajout de vêtement
const vetementSchema = z.object({
  nom: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  categorie: z.string().min(1, { message: "Veuillez sélectionner une catégorie" }),
  couleur: z.string().min(1, { message: "Veuillez choisir une couleur" }),
  taille: z.string().min(1, { message: "Veuillez sélectionner une taille" }),
  description: z.string().optional(),
  marque: z.string().optional(),
});

type VetementFormValues = z.infer<typeof vetementSchema>;

const AjouterVetementPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Initialiser le formulaire avec react-hook-form
  const form = useForm<VetementFormValues>({
    resolver: zodResolver(vetementSchema),
    defaultValues: {
      nom: "",
      categorie: "",
      couleur: "",
      taille: "",
      description: "",
      marque: "",
    },
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: VetementFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Utiliser notre service pour ajouter le vêtement
      await addVetement({
        nom: data.nom,
        categorie: data.categorie,
        couleur: data.couleur,
        taille: data.taille,
        description: data.description || null,
        marque: data.marque || null,
        image_url: imagePreview || null,
      });
      
      toast({
        title: "Vêtement ajouté avec succès!",
        description: "Votre nouveau vêtement a été ajouté à votre collection.",
      });
      
      // Rediriger vers la liste des vêtements
      navigate("/mes-vetements/liste");
    } catch (error) {
      console.error("Erreur lors de l'ajout du vêtement:", error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'ajout du vêtement.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="pt-24 pb-6 bg-accent/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate("/mes-vetements")}
              className="rounded-full"
            >
              <ArrowLeft size={20} />
            </Button>
            <Heading>Ajouter un vêtement</Heading>
          </div>
          <Text className="text-muted-foreground max-w-2xl mt-4">
            Remplissez le formulaire ci-dessous pour ajouter un nouveau vêtement à votre collection.
          </Text>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Colonne de gauche: Image */}
          <div className="md:col-span-1 flex flex-col items-center">
            <div 
              className="w-full aspect-square rounded-lg border-2 border-dashed border-primary/20 hover:border-primary/50 transition-colors bg-background flex flex-col items-center justify-center cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <img 
                  src={imagePreview} 
                  alt="Aperçu du vêtement" 
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="text-center p-8">
                  <ImagePlus size={48} className="mx-auto text-muted-foreground" />
                  <Text className="mt-4">Cliquez pour ajouter une image</Text>
                  <Text variant="subtle" className="mt-2">
                    JPG, PNG ou GIF. Max 5MB.
                  </Text>
                </div>
              )}
              <input
                type="file"
                className="hidden"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
              />
            </div>
            {imagePreview && (
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setImagePreview(null)}
              >
                Supprimer l'image
              </Button>
            )}
          </div>
          
          {/* Colonne de droite: Formulaire */}
          <div className="md:col-span-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner une catégorie" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="t-shirt">T-shirt</SelectItem>
                            <SelectItem value="chemise">Chemise</SelectItem>
                            <SelectItem value="pantalon">Pantalon</SelectItem>
                            <SelectItem value="jeans">Jeans</SelectItem>
                            <SelectItem value="veste">Veste</SelectItem>
                            <SelectItem value="pull">Pull</SelectItem>
                            <SelectItem value="robe">Robe</SelectItem>
                            <SelectItem value="jupe">Jupe</SelectItem>
                            <SelectItem value="short">Short</SelectItem>
                            <SelectItem value="manteau">Manteau</SelectItem>
                            <SelectItem value="chaussures">Chaussures</SelectItem>
                            <SelectItem value="accessoire">Accessoire</SelectItem>
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
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner une couleur" />
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
                        <FormControl>
                          <Input placeholder="Nom de la marque" {...field} />
                        </FormControl>
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
                
                {/* Boutons d'action */}
                <div className="flex justify-end gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/mes-vetements")}
                  >
                    Annuler
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>Traitement en cours...</>
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" />
                        Ajouter le vêtement
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AjouterVetementPage;

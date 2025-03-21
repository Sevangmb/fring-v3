import React, { useEffect, useState } from "react";
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
import { Shirt, ArrowLeft, ImagePlus, Plus, Loader2, LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { addVetement } from "@/services/supabaseService";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { detectImageColor } from "@/services/colorDetectionService";

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
  const { user, loading: authLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const [detectingColor, setDetectingColor] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [marques, setMarques] = useState<Marque[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

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

  useEffect(() => {
    // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
    if (!authLoading && !user) {
      toast({
        title: "Non autorisé",
        description: "Vous devez être connecté pour ajouter un vêtement.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    // Charger les catégories depuis Supabase
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('nom');
        
        if (error) {
          console.error("Erreur lors du chargement des catégories:", error);
          toast({
            title: "Erreur",
            description: "Impossible de charger les catégories.",
            variant: "destructive",
          });
        } else {
          setCategories(data || []);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des catégories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };

    // Charger les marques depuis Supabase
    const fetchMarques = async () => {
      try {
        const { data, error } = await supabase
          .from('marques')
          .select('*')
          .order('nom');
        
        if (error) {
          console.error("Erreur lors du chargement des marques:", error);
        } else {
          setMarques(data || []);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des marques:", error);
      }
    };

    if (user) {
      fetchCategories();
      fetchMarques();
    }
  }, [user, authLoading, toast, navigate]);

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Afficher une prévisualisation
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      if (!user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour télécharger des images.",
          variant: "destructive",
        });
        return;
      }

      // Télécharger l'image sur Supabase Storage
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        
        // Vérifier si le bucket "vetements" existe, sinon on utilise une URL locale
        const { data: bucketData, error: bucketError } = await supabase.storage.getBucket('vetements');
        
        let publicUrl = '';
        
        if (bucketError) {
          console.warn("Le bucket 'vetements' n'existe pas, l'image sera stockée localement", bucketError);
          // On garde l'image en local avec le dataURL
          publicUrl = reader.result as string;
        } else {
          const { data, error } = await supabase.storage
            .from('vetements')
            .upload(`images/${fileName}`, file);

          if (error) {
            console.error("Erreur lors du téléchargement de l'image:", error);
            toast({
              title: "Erreur",
              description: "Impossible de télécharger l'image.",
              variant: "destructive",
            });
            return;
          }

          // Obtenir l'URL publique de l'image
          const { data: { publicUrl: storedPublicUrl } } = supabase.storage
            .from('vetements')
            .getPublicUrl(`images/${fileName}`);
            
          publicUrl = storedPublicUrl;
          setImagePreview(publicUrl);
        }
        
        // Détecter la couleur de l'image
        if (publicUrl) {
          setDetectingColor(true);
          try {
            const detectedColor = await detectImageColor(publicUrl);
            form.setValue('couleur', detectedColor);
            toast({
              title: "Couleur détectée",
              description: `La couleur ${detectedColor} a été détectée et sélectionnée automatiquement.`,
            });
          } catch (error) {
            console.error("Erreur lors de la détection de couleur:", error);
          } finally {
            setDetectingColor(false);
          }
        }
      } catch (error) {
        console.error("Erreur lors du téléchargement de l'image:", error);
        setDetectingColor(false);
      }
    }
  };

  const onSubmit = async (data: VetementFormValues) => {
    if (!user) {
      toast({
        title: "Non autorisé",
        description: "Vous devez être connecté pour ajouter un vêtement.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Utiliser notre service pour ajouter le vêtement (avec user_id ajouté dans le service)
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

  // Affichage conditionnel en fonction de l'authentification
  if (authLoading) {
    return (
      <Layout>
        <div className="pt-24 flex items-center justify-center">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-64 bg-muted rounded-lg"></div>
            <div className="h-4 w-48 bg-muted rounded-lg mx-auto"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="pt-24 pb-6 bg-accent/10">
          <div className="container mx-auto px-4 text-center">
            <Heading>Ajout de vêtement</Heading>
            <Text className="text-muted-foreground max-w-2xl mx-auto mt-4">
              Vous devez être connecté pour ajouter un vêtement à votre collection.
            </Text>
            <div className="mt-8">
              <Button asChild>
                <Link to="/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  Se connecter
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

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
              className="w-full aspect-square rounded-lg border-2 border-dashed border-primary/20 hover:border-primary/50 transition-colors bg-background flex flex-col items-center justify-center cursor-pointer relative"
              onClick={() => fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <>
                  <img 
                    src={imagePreview} 
                    alt="Aperçu du vêtement" 
                    className="w-full h-full object-cover rounded-lg"
                  />
                  {detectingColor && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                      <div className="text-center text-white">
                        <Loader2 size={48} className="mx-auto animate-spin" />
                        <Text className="mt-4 text-white">Détection de la couleur...</Text>
                      </div>
                    </div>
                  )}
                </>
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
                onClick={() => {
                  setImagePreview(null);
                  form.setValue('couleur', '');
                }}
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
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Traitement en cours...
                      </>
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


import React, { useState, useEffect } from "react";
import Layout from "@/components/templates/Layout";
import { Heading, Text } from "@/components/atoms/Typography";
import Button from "@/components/atoms/Button";
import Card from "@/components/molecules/Card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, LogOut, User, Mail, Calendar, Shield, Check, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

// Schéma de validation pour le formulaire de profil
const profileSchema = z.object({
  name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  email: z.string().email({ message: "Format d'email invalide" }).optional(),
  avatar_url: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const Profile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarsBucketExists, setAvatarsBucketExists] = useState(false);

  // Vérification du bucket avatars au chargement
  useEffect(() => {
    const checkAvatarsBucket = async () => {
      try {
        const { data: buckets, error } = await supabase.storage.listBuckets();
        
        if (!error && buckets) {
          const exists = buckets.some(bucket => bucket.name === 'avatars');
          setAvatarsBucketExists(exists);
          
          if (!exists) {
            // Tentative de création du bucket
            await createAvatarsBucket();
          }
        }
      } catch (err) {
        console.error("Erreur lors de la vérification du bucket avatars:", err);
      }
    };
    
    checkAvatarsBucket();
  }, []);

  // Fonction pour créer le bucket avatars
  const createAvatarsBucket = async () => {
    try {
      const { error } = await supabase.storage.createBucket('avatars', {
        public: true,
        fileSizeLimit: 5242880, // 5MB
      });
      
      if (error) {
        console.error("Erreur lors de la création du bucket avatars:", error);
        toast({
          title: "Avertissement",
          description: "Impossible de créer l'espace de stockage pour les avatars. Contactez l'administrateur.",
          variant: "destructive",
        });
      } else {
        setAvatarsBucketExists(true);
        console.log("Bucket avatars créé avec succès");
      }
    } catch (error) {
      console.error("Exception lors de la création du bucket avatars:", error);
    }
  };

  // Initialisation du formulaire avec les valeurs actuelles
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.user_metadata?.name || "",
      email: user?.email || "",
      avatar_url: user?.user_metadata?.avatar_url || "",
    },
  });

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const handleBack = () => {
    navigate("/dashboard");
  };

  const toggleEdit = () => {
    if (isEditing) {
      // Si on quitte le mode édition, on réinitialise le formulaire
      form.reset({
        name: user?.user_metadata?.name || "",
        email: user?.email || "",
        avatar_url: user?.user_metadata?.avatar_url || "",
      });
      setAvatarPreview(null);
    }
    setIsEditing(!isEditing);
  };

  const onSubmit = async (data: ProfileFormValues) => {
    setIsLoading(true);
    try {
      // Préparer les métadonnées à mettre à jour
      const updates = {
        data: {
          name: data.name,
        },
        avatar_url: data.avatar_url,
      };

      // Mettre à jour les métadonnées de l'utilisateur
      const { error } = await supabase.auth.updateUser({
        data: updates.data,
      });

      if (error) {
        throw error;
      }

      // Gérer l'upload d'avatar si un nouveau fichier a été sélectionné
      if (avatarPreview && avatarPreview !== user?.user_metadata?.avatar_url) {
        if (!avatarsBucketExists) {
          // Si le bucket n'existe pas encore, tenter de le créer
          await createAvatarsBucket();
          
          // Vérifier si la création a réussi
          if (!avatarsBucketExists) {
            toast({
              title: "Erreur",
              description: "Impossible de créer l'espace de stockage pour les avatars. L'image de profil n'a pas été mise à jour.",
              variant: "destructive",
            });
            
            setIsLoading(false);
            setIsEditing(false);
            return;
          }
        }
        
        try {
          // Extraire le fichier Base64 et le convertir en Blob
          const base64Data = avatarPreview.split(',')[1];
          const blob = await fetch(`data:image/jpeg;base64,${base64Data}`).then(res => res.blob());
          
          // Générer un nom de fichier unique
          const fileExt = "jpg";
          const fileName = `${user?.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
          
          // Uploader le fichier
          const { error: uploadError, data: uploadData } = await supabase.storage
            .from('avatars')
            .upload(fileName, blob);
            
          if (uploadError) {
            throw uploadError;
          }
          
          // Récupérer l'URL publique
          const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(fileName);
          
          // Mettre à jour l'URL de l'avatar dans les métadonnées utilisateur
          if (urlData) {
            await supabase.auth.updateUser({
              data: {
                avatar_url: urlData.publicUrl,
              },
            });
          }
        } catch (uploadError: any) {
          console.error("Erreur lors de l'upload de l'avatar:", uploadError);
          toast({
            title: "Erreur lors de l'upload de l'avatar",
            description: uploadError.message || "Impossible de télécharger votre avatar. Veuillez réessayer.",
            variant: "destructive",
          });
        }
      }

      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été mises à jour avec succès",
      });
      
      setIsEditing(false);
    } catch (error: any) {
      toast({
        title: "Erreur de mise à jour",
        description: error.message || "Une erreur est survenue lors de la mise à jour du profil",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour gérer l'upload d'avatar
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setAvatarPreview(reader.result);
        form.setValue('avatar_url', reader.result);
      }
    };
    
    reader.readAsDataURL(file);
  };

  // Fonction pour obtenir les initiales de l'utilisateur
  const getUserInitials = () => {
    const name = user?.user_metadata?.name || user?.email || "";
    if (name) {
      const parts = name.split(/\s+/);
      if (parts.length > 1) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      }
      return name[0].toUpperCase();
    }
    return "U";
  };

  // Fonction pour formater la date d'inscription
  const formatJoinDate = () => {
    if (user?.created_at) {
      const date = new Date(user.created_at);
      return date.toLocaleDateString('fr-FR', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
    return "Date inconnue";
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-3xl mx-auto">
          <Button 
            variant="ghost" 
            className="mb-6 flex items-center gap-2" 
            onClick={handleBack}
          >
            <ArrowLeft size={18} />
            Retour au tableau de bord
          </Button>
          
          <Heading variant="h3" className="mb-6">Mon profil</Heading>
          
          <Card className="p-8">
            {isEditing ? (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex flex-col items-center">
                      <Avatar className="w-24 h-24 text-2xl mb-3">
                        <AvatarImage 
                          src={avatarPreview || user?.user_metadata?.avatar_url} 
                          alt={form.getValues("name")} 
                        />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="mt-3">
                        <Input
                          type="file"
                          id="avatar"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="w-full text-xs"
                        />
                        <Text variant="small" className="text-muted-foreground mt-1">
                          JPG, PNG ou GIF. Max 2MB.
                        </Text>
                        {!avatarsBucketExists && (
                          <Text variant="small" className="text-destructive mt-1">
                            Avertissement: Stockage des avatars non disponible.
                          </Text>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex-1 space-y-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nom complet</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Votre nom" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input 
                                type="email"
                                placeholder="Votre email" 
                                {...field} 
                                disabled
                              />
                            </FormControl>
                            <Text variant="small" className="text-muted-foreground">
                              L'email ne peut pas être modifié ici.
                            </Text>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={toggleEdit}
                      className="flex items-center gap-1"
                    >
                      <X size={16} />
                      Annuler
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isLoading}
                      className="flex items-center gap-1"
                    >
                      {isLoading ? "Enregistrement..." : (
                        <>
                          <Check size={16} />
                          Enregistrer
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            ) : (
              <div className="flex flex-col items-center md:flex-row md:items-start gap-8">
                <div className="flex flex-col items-center">
                  <Avatar className="w-24 h-24 text-2xl mb-3">
                    <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.user_metadata?.name || "Utilisateur"} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2 text-xs flex items-center gap-1"
                    onClick={toggleEdit}
                  >
                    <Edit size={12} />
                    Modifier
                  </Button>
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <Heading variant="h4" className="mb-1">
                    {user?.user_metadata?.name || user?.email?.split('@')[0] || "Utilisateur"}
                  </Heading>
                  <Text variant="subtle" className="mb-6">
                    {user?.email}
                  </Text>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="flex items-start gap-2">
                      <User size={16} className="mt-1 text-muted-foreground" />
                      <div>
                        <Text variant="small" className="text-muted-foreground">ID Utilisateur</Text>
                        <Text className="font-medium truncate">{user?.id}</Text>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Calendar size={16} className="mt-1 text-muted-foreground" />
                      <div>
                        <Text variant="small" className="text-muted-foreground">Inscrit le</Text>
                        <Text className="font-medium">{formatJoinDate()}</Text>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Shield size={16} className="mt-1 text-muted-foreground" />
                      <div>
                        <Text variant="small" className="text-muted-foreground">Rôle</Text>
                        <Text className="font-medium">{user?.role || "Utilisateur"}</Text>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Mail size={16} className="mt-1 text-muted-foreground" />
                      <div>
                        <Text variant="small" className="text-muted-foreground">Email vérifié</Text>
                        <Text className="font-medium">
                          {user?.email_confirmed_at ? "Oui" : "Non"}
                        </Text>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    variant="primary" 
                    onClick={handleLogout} 
                    className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
                  >
                    <LogOut size={16} />
                    Se déconnecter
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;

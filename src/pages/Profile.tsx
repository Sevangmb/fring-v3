import React, { useState, useEffect } from "react";
import Layout from "@/components/templates/Layout";
import { Heading, Text } from "@/components/atoms/Typography";
import Button from "@/components/atoms/Button";
import Card from "@/components/molecules/Card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Edit, LogOut, User, Mail, Calendar, Shield, Check, X, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

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
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

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

  const toggleEdit = () => {
    if (isEditing) {
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
      const updates = {
        data: {
          name: data.name,
        },
      };

      const { error } = await supabase.auth.updateUser({
        data: updates.data,
      });

      if (error) {
        throw error;
      }

      if (avatarPreview && avatarPreview !== user?.user_metadata?.avatar_url) {
        try {
          setUploadingAvatar(true);
          const base64Data = avatarPreview.split(',')[1];
          const blob = await fetch(`data:image/jpeg;base64,${base64Data}`).then(res => res.blob());
          
          const fileExt = "jpg";
          const fileName = `${user?.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
          
          const { error: uploadError, data: uploadData } = await supabase.storage
            .from('avatars')
            .upload(fileName, blob);
            
          if (uploadError) {
            throw uploadError;
          }
          
          const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(fileName);
          
          if (urlData) {
            await supabase.auth.updateUser({
              data: {
                avatar_url: urlData.publicUrl,
              },
            });
          }
          
          toast({
            title: "Avatar mis à jour",
            description: "Votre avatar a été mis à jour avec succès.",
          });
        } catch (uploadError: any) {
          console.error("Erreur lors de l'upload de l'avatar:", uploadError);
          toast({
            title: "Erreur lors de l'upload de l'avatar",
            description: uploadError.message || "Impossible de télécharger votre avatar. Veuillez réessayer.",
            variant: "destructive",
          });
        } finally {
          setUploadingAvatar(false);
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
          <Heading variant="h3" className="mb-6">Mon profil</Heading>
          
          <Card className="p-8">
            {isEditing ? (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex flex-col items-center">
                      <Avatar className="w-24 h-24 text-2xl mb-3">
                        {uploadingAvatar ? (
                          <div className="w-24 h-24 bg-muted flex items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                          </div>
                        ) : (
                          <>
                            <AvatarImage 
                              src={avatarPreview || user?.user_metadata?.avatar_url} 
                              alt={form.getValues("name")} 
                            />
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              {getUserInitials()}
                            </AvatarFallback>
                          </>
                        )}
                      </Avatar>
                      
                      <div className="mt-3">
                        <Input
                          type="file"
                          id="avatar"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="w-full text-xs"
                          disabled={uploadingAvatar}
                        />
                        <Text variant="small" className="text-muted-foreground mt-1">
                          JPG, PNG ou GIF. Max 2MB.
                        </Text>
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
                      disabled={isLoading || uploadingAvatar}
                      className="flex items-center gap-1"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Enregistrement...
                        </>
                      ) : (
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

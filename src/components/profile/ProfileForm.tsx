
import React from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Button from "@/components/atoms/Button";
import { Check, X, Loader2, Mail, User as UserIcon, MapPin } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import ProfileAvatar from "./ProfileAvatar";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/atoms/Typography";

// Définition du schéma du formulaire
export const profileSchema = z.object({
  name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  email: z.string().email({ message: "Format d'email invalide" }).optional(),
  avatar_url: z.string().optional(),
  location: z.string().optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  form: UseFormReturn<ProfileFormValues>;
  onSubmit: (data: ProfileFormValues) => Promise<void>;
  isLoading: boolean;
  isUploading: boolean;
  avatarPreview: string | null;
  userEmail: string;
  userInitials: string;
  onToggleEdit: () => void;
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  form,
  onSubmit,
  isLoading,
  isUploading,
  avatarPreview,
  userEmail,
  userInitials,
  onToggleEdit,
  onAvatarChange
}) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row gap-8">
          <ProfileAvatar
            avatarUrl={avatarPreview}
            userInitials={userInitials}
            isEditing={true}
            isUploading={isUploading}
            onAvatarChange={onAvatarChange}
          />
          
          <div className="flex-1 space-y-6">
            <Card className="border border-primary/10 shadow-sm bg-card/80 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-montserrat flex items-center gap-2">
                  <UserIcon size={16} className="text-primary" />
                  Mes informations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-montserrat">Nom complet</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input 
                            placeholder="Votre nom" 
                            {...field} 
                            className="font-montserrat pl-10 border-primary/20 focus:border-primary transition-colors"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="font-montserrat text-xs" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-montserrat">Localisation</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input 
                            placeholder="Votre ville" 
                            {...field} 
                            value={field.value || ''}
                            className="font-montserrat pl-10 border-primary/20 focus:border-primary transition-colors"
                          />
                        </div>
                      </FormControl>
                      <Text className="text-xs text-muted-foreground font-montserrat mt-1">
                        Ville ou région où vous résidez
                      </Text>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-montserrat">Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input 
                            type="email"
                            placeholder="Votre email" 
                            {...field} 
                            disabled
                            className="font-montserrat bg-muted/50 pl-10"
                          />
                        </div>
                      </FormControl>
                      <Text className="text-xs text-muted-foreground font-montserrat mt-1">
                        L'email ne peut pas être modifié ici.
                      </Text>
                      <FormMessage className="font-montserrat text-xs" />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onToggleEdit}
            className="flex items-center gap-1 font-montserrat border-red-300 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <X size={16} />
            Annuler
          </Button>
          <Button 
            type="submit" 
            disabled={isLoading || isUploading}
            className="flex items-center gap-1 font-montserrat bg-primary hover:bg-primary/90 transition-colors"
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
  );
};

export default ProfileForm;

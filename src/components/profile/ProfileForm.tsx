
import React from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Button from "@/components/atoms/Button";
import { Check, X, Loader2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import ProfileAvatar from "./ProfileAvatar";
import { z } from "zod";

// Définition du schéma du formulaire
export const profileSchema = z.object({
  name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  email: z.string().email({ message: "Format d'email invalide" }).optional(),
  avatar_url: z.string().optional(),
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
                      className="font-montserrat"
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
                      className="font-montserrat bg-muted/50"
                    />
                  </FormControl>
                  <p className="text-sm text-muted-foreground font-montserrat">
                    L'email ne peut pas être modifié ici.
                  </p>
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
            onClick={onToggleEdit}
            className="flex items-center gap-1 font-montserrat"
          >
            <X size={16} />
            Annuler
          </Button>
          <Button 
            type="submit" 
            disabled={isLoading || isUploading}
            className="flex items-center gap-1 font-montserrat"
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

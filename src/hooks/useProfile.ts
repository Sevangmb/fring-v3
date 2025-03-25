import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/lib/supabase";
import { ProfileFormValues, profileSchema } from "@/components/profile/ProfileForm";
import { uploadAvatar } from "@/services/user";

export const useProfile = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [userStats, setUserStats] = useState({
    vetementCount: 0,
    ensembleCount: 0,
    friendsCount: 0,
    favorisCount: 0,
    isLoading: true
  });

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.user_metadata?.name || "",
      email: user?.email || "",
      avatar_url: user?.user_metadata?.avatar_url || "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.user_metadata?.name || "",
        email: user.email || "",
        avatar_url: user.user_metadata?.avatar_url || "",
      });
    }
  }, [user, form]);

  useEffect(() => {
    if (user) {
      const fetchUserStats = async () => {
        try {
          const { count: vetementCount, error: vetementError } = await supabase
            .from('vetements')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', user.id);
          
          if (vetementError) throw vetementError;
          
          const { count: ensembleCount, error: ensembleError } = await supabase
            .from('tenues')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', user.id);
          
          if (ensembleError) throw ensembleError;
          
          const { count: friendsCount, error: friendsError } = await supabase
            .from('amis')
            .select('id', { count: 'exact', head: true })
            .or(`user_id.eq.${user.id},ami_id.eq.${user.id}`)
            .eq('status', 'accepted');
          
          if (friendsError) throw friendsError;
          
          const { count: favorisCount, error: favorisError } = await supabase
            .from('favoris')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', user.id);
          
          if (favorisError) throw favorisError;
          
          setUserStats({
            vetementCount: vetementCount || 0,
            ensembleCount: ensembleCount || 0,
            friendsCount: friendsCount || 0,
            favorisCount: favorisCount || 0,
            isLoading: false
          });
        } catch (error) {
          console.error("Erreur lors du chargement des statistiques:", error);
          setUserStats(prev => ({ ...prev, isLoading: false }));
        }
      };
      
      fetchUserStats();
    }
  }, [user]);

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

  const processAvatarUpload = async () => {
    if (!avatarPreview || !user || avatarPreview === user?.user_metadata?.avatar_url) {
      return null;
    }
    
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
        return urlData.publicUrl;
      }
    } catch (error) {
      throw error;
    } finally {
      setUploadingAvatar(false);
    }
    
    return null;
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

      try {
        await processAvatarUpload();
        
        toast({
          title: "Profil mis à jour",
          description: "Vos informations ont été mises à jour avec succès",
        });
      } catch (uploadError: any) {
        console.error("Erreur lors de l'upload de l'avatar:", uploadError);
        toast({
          title: "Erreur lors de l'upload de l'avatar",
          description: uploadError.message || "Impossible de télécharger votre avatar. Veuillez réessayer.",
          variant: "destructive",
        });
      }
      
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

  const getLastActivityDate = () => {
    const now = new Date();
    return now.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long'
    });
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès.",
      });
    } catch (error: any) {
      toast({
        title: "Erreur de déconnexion",
        description: error.message || "Une erreur est survenue lors de la déconnexion",
        variant: "destructive",
      });
    }
  };

  return {
    user,
    form,
    isEditing,
    isLoading,
    uploadingAvatar,
    avatarPreview,
    userStats,
    getUserInitials,
    formatJoinDate,
    getLastActivityDate,
    toggleEdit,
    handleAvatarChange,
    onSubmit,
    handleLogout
  };
};

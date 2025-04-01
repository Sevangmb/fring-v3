
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AdminUserData } from '@/services/adminService';
import { updateUserMetadata, getUserById } from '@/services/userService';
import { Loader2 } from 'lucide-react';

interface UserProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: AdminUserData | null;
}

const UserProfileDialog: React.FC<UserProfileDialogProps> = ({ open, onOpenChange, user }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (user && open) {
        setLoading(true);
        try {
          const details = await getUserById(user.id);
          setUserData({
            full_name: user.user_metadata?.full_name || '',
            bio: details?.bio || '',
            phone: details?.phone || '',
            location: details?.location || '',
            ...user.user_metadata,
            ...details
          });
        } catch (error) {
          console.error("Erreur lors de la récupération des détails utilisateur:", error);
          toast({
            title: "Erreur",
            description: "Impossible de charger les détails de l'utilisateur",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserDetails();
  }, [user, open, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!user || !userData) return;

    setSaving(true);
    try {
      // Mise à jour des métadonnées utilisateur
      const result = await updateUserMetadata({
        full_name: userData.full_name,
        bio: userData.bio,
        phone: userData.phone,
        location: userData.location
      });

      if (result.success) {
        toast({
          title: "Profil mis à jour",
          description: "Le profil de l'utilisateur a été mis à jour avec succès",
        });
        onOpenChange(false);
      } else {
        throw result.error;
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le profil",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Profil Utilisateur</DialogTitle>
          <DialogDescription>
            Gérer les informations du profil de {user.email}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Chargement des données...</span>
          </div>
        ) : (
          <div className="py-4 space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                {userData?.avatar_url && (
                  <AvatarImage src={userData.avatar_url} alt={userData.full_name || user.email} />
                )}
                <AvatarFallback className="text-lg">
                  {user.email.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">{userData?.full_name || 'Utilisateur'}</h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Nom complet</Label>
                  <Input
                    id="full_name"
                    name="full_name"
                    value={userData?.full_name || ''}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={userData?.phone || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Localisation</Label>
                <Input
                  id="location"
                  name="location"
                  value={userData?.location || ''}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Biographie</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  rows={4}
                  value={userData?.bio || ''}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={saving}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleSave}
            disabled={loading || saving}
          >
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileDialog;

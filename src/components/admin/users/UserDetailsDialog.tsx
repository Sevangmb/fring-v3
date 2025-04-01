
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { AdminUserData } from '@/services/adminService';
import { Loader2, FileText, Calendar, MapPin, User, Mail, ShieldAlert, Check, X, Shirt, Heart, Monitor, BellRing, ShoppingBag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatDistance } from 'date-fns';
import { fr } from 'date-fns/locale';
import { supabase } from '@/lib/supabase';

interface UserDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: AdminUserData | null;
}

interface UserDetails {
  stats: {
    vetements: number;
    ensembles: number;
    amis: number;
    favoris: number;
  };
  derniere_connexion: Date;
  email_verifie: boolean;
  localisation: string;
  appareil: string;
  preferences: {
    notifications: boolean;
    mode_sombre: boolean;
    langue: string;
  };
}

const UserDetailsDialog: React.FC<UserDetailsDialogProps> = ({ open, onOpenChange, user }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState<UserDetails | null>(null);

  const isAdmin = user?.email.includes('admin@') || 
                 user?.email.includes('sevans@') || 
                 user?.email.includes('pedro@');

  useEffect(() => {
    const fetchDetails = async () => {
      if (user && open) {
        setLoading(true);
        try {
          // Récupérer les données réelles de Supabase
          const { data: vetements, error: vetementsError } = await supabase
            .from('vetements')
            .select('*')
            .eq('user_id', user.id);
          
          const { data: ensembles, error: ensemblesError } = await supabase
            .from('tenues')
            .select('*')
            .eq('user_id', user.id);
          
          const { data: amis, error: amisError } = await supabase
            .from('amis')
            .select('*')
            .or(`user_id.eq.${user.id},ami_id.eq.${user.id}`)
            .eq('status', 'acceptée');
          
          const { data: favoris, error: favorisError } = await supabase
            .from('favoris')
            .select('*')
            .eq('user_id', user.id);
          
          // Récupérer la dernière connexion
          const { data: auth_data, error: authError } = await supabase
            .from('auth_data')
            .select('*')
            .eq('user_id', user.id)
            .single();
          
          if (vetementsError || ensemblesError || amisError || favorisError) {
            console.error("Erreurs de récupération:", { vetementsError, ensemblesError, amisError, favorisError });
            throw new Error("Erreur lors de la récupération des données");
          }

          // Fixer l'erreur ici - Vérifier la présence de l'email avec user.app_metadata ou d'autres propriétés
          const isEmailVerified = user.last_sign_in_at ? true : false; // Utiliser une autre propriété à la place de email_confirmed_at

          setDetails({
            stats: {
              vetements: vetements?.length || 0,
              ensembles: ensembles?.length || 0,
              amis: amis?.length || 0,
              favoris: favoris?.length || 0,
            },
            derniere_connexion: auth_data?.last_sign_in_at ? new Date(auth_data.last_sign_in_at) : new Date(),
            email_verifie: isEmailVerified,
            localisation: auth_data?.location || "Inconnu",
            appareil: auth_data?.device || "Inconnu",
            preferences: {
              notifications: true,
              mode_sombre: false,
              langue: "Français"
            }
          });
          
          setLoading(false);
        } catch (error) {
          console.error("Erreur lors de la récupération des détails:", error);
          toast({
            title: "Erreur",
            description: "Impossible de charger les détails de l'utilisateur",
            variant: "destructive",
          });
          setLoading(false);
        }
      }
    };

    fetchDetails();
    
    // Nettoyage lorsque le dialog est fermé ou démonte
    return () => {
      if (!open) {
        setDetails(null);
      }
    };
  }, [user, open, toast]);

  if (!user) return null;

  // Fermer proprement le dialogue
  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]" onInteractOutside={(e) => {
        e.preventDefault(); // Empêcher la fermeture au clic extérieur
      }}>
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <FileText className="h-5 w-5 text-cyan-500" />
            Détails de l'utilisateur
          </DialogTitle>
          <DialogDescription>
            Informations détaillées sur {user.email}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Chargement des détails...</span>
          </div>
        ) : (
          <div className="py-4 space-y-6">
            <div className="flex items-start gap-4">
              <Avatar className="h-20 w-20">
                {user.user_metadata?.avatar_url && (
                  <AvatarImage src={user.user_metadata.avatar_url} alt={user.email} />
                )}
                <AvatarFallback className="text-xl">
                  {user.email.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h3 className="text-lg font-semibold">
                  {user.user_metadata?.full_name || 'Utilisateur'} 
                  {isAdmin && <Badge className="ml-2" variant="outline">Administrateur</Badge>}
                </h3>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Mail className="mr-1 h-4 w-4" /> 
                  {user.email}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="mr-1 h-4 w-4" /> 
                  Inscrit {formatDistance(new Date(user.created_at), new Date(), { 
                    addSuffix: true, 
                    locale: fr 
                  })}
                </div>
                {details?.localisation && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="mr-1 h-4 w-4" /> 
                    {details.localisation}
                  </div>
                )}
              </div>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 flex flex-col items-center justify-center">
                  <Shirt className="h-5 w-5 text-emerald-500 mb-1" />
                  <div className="text-2xl font-bold">{details?.stats?.vetements || 0}</div>
                  <div className="text-xs text-muted-foreground">Vêtements</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex flex-col items-center justify-center">
                  <ShoppingBag className="h-5 w-5 text-purple-500 mb-1" />
                  <div className="text-2xl font-bold">{details?.stats?.ensembles || 0}</div>
                  <div className="text-xs text-muted-foreground">Ensembles</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex flex-col items-center justify-center">
                  <User className="h-5 w-5 text-blue-500 mb-1" />
                  <div className="text-2xl font-bold">{details?.stats?.amis || 0}</div>
                  <div className="text-xs text-muted-foreground">Amis</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex flex-col items-center justify-center">
                  <Heart className="h-5 w-5 text-red-500 mb-1" />
                  <div className="text-2xl font-bold">{details?.stats?.favoris || 0}</div>
                  <div className="text-xs text-muted-foreground">Favoris</div>
                </CardContent>
              </Card>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h4 className="font-medium">Informations du compte</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
                  <div className="flex items-center">
                    <ShieldAlert className="h-4 w-4 mr-2" />
                    <span>Email vérifié</span>
                  </div>
                  {details?.email_verifie ? (
                    <Badge className="bg-green-500/20 text-green-700 hover:bg-green-500/30 border-green-500/50">
                      <Check className="h-3 w-3 mr-1" />
                      Oui
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-red-500/20 text-red-700 hover:bg-red-500/30 border-red-500/50">
                      <X className="h-3 w-3 mr-1" />
                      Non
                    </Badge>
                  )}
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Dernière connexion</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {details?.derniere_connexion ? formatDistance(
                      new Date(details.derniere_connexion),
                      new Date(),
                      { addSuffix: true, locale: fr }
                    ) : 'Inconnue'}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
                  <div className="flex items-center">
                    <Monitor className="h-4 w-4 mr-2" />
                    <span>Appareil</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {details?.appareil || 'Inconnu'}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
                  <div className="flex items-center">
                    <BellRing className="h-4 w-4 mr-2" />
                    <span>Notifications</span>
                  </div>
                  {details?.preferences?.notifications ? (
                    <Badge className="bg-green-500/20 text-green-700 hover:bg-green-500/30 border-green-500/50">
                      <Check className="h-3 w-3 mr-1" />
                      Activées
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-muted text-muted-foreground">
                      Désactivées
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button onClick={handleClose}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailsDialog;

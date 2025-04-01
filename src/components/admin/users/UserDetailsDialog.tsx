
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { AdminUserData } from '@/services/adminService';
import { Loader2, FileText, Calendar, MapPin, User, Mail, ShieldAlert, Check, X, Shirt, Heart, Monitor, BellRing } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatDistance } from 'date-fns';
import { fr } from 'date-fns/locale';

interface UserDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: AdminUserData | null;
}

const UserDetailsDialog: React.FC<UserDetailsDialogProps> = ({ open, onOpenChange, user }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState<any>(null);

  const isAdmin = user?.email.includes('admin@') || 
                 user?.email.includes('sevans@') || 
                 user?.email.includes('pedro@');

  useEffect(() => {
    const fetchDetails = async () => {
      if (user && open) {
        setLoading(true);
        try {
          // Dans une application réelle, nous ferions un appel API ici
          // const response = await getUserDetailedInfo(user.id);
          // setDetails(response);
          
          // Pour cette démo, utilisons des données fictives
          setTimeout(() => {
            setDetails({
              stats: {
                vetements: Math.floor(Math.random() * 30) + 5,
                ensembles: Math.floor(Math.random() * 15) + 2,
                amis: Math.floor(Math.random() * 20) + 3,
                favoris: Math.floor(Math.random() * 25) + 4,
              },
              derniere_connexion: new Date(Date.now() - Math.floor(Math.random() * 10) * 86400000),
              email_verifie: Math.random() > 0.3,
              localisation: "Paris, France",
              appareil: "iPhone, Safari",
              preferences: {
                notifications: true,
                mode_sombre: false,
                langue: "Français"
              }
            });
            setLoading(false);
          }, 1000);
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
  }, [user, open, toast]);

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
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
          <Button onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailsDialog;

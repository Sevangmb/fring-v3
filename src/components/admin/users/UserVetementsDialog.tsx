
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { AdminUserData } from '@/services/adminService';
import { Loader2, Shirt } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';

interface UserVetementsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: AdminUserData | null;
}

interface Vetement {
  id: number;
  nom: string;
  categorie: string;
  couleur: string;
  date_ajout: string;
}

const UserVetementsDialog: React.FC<UserVetementsDialogProps> = ({ open, onOpenChange, user }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [vetements, setVetements] = useState<Vetement[]>([]);

  useEffect(() => {
    const fetchVetements = async () => {
      if (user && open) {
        setLoading(true);
        try {
          // Récupérer les vêtements réels depuis Supabase
          const { data, error } = await supabase
            .from('vetements')
            .select(`
              id,
              nom,
              categorie:categorie_id(nom),
              couleur,
              created_at
            `)
            .eq('user_id', user.id);
          
          if (error) throw error;
          
          // Transformer les données
          const formattedVetements = data.map((item: any) => ({
            id: item.id,
            nom: item.nom || 'Sans nom',
            categorie: item.categorie?.nom || 'Non catégorisé',
            couleur: item.couleur || 'Non spécifié',
            date_ajout: new Date(item.created_at).toLocaleDateString('fr-FR')
          }));
          
          setVetements(formattedVetements);
        } catch (error) {
          console.error("Erreur lors de la récupération des vêtements:", error);
          toast({
            title: "Erreur",
            description: "Impossible de charger les vêtements de l'utilisateur",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      }
    };

    fetchVetements();
    
    // Nettoyage lorsque le dialog est fermé
    return () => {
      if (!open) {
        setVetements([]);
      }
    };
  }, [user, open, toast]);

  if (!user) return null;

  // Fonction pour fermer proprement le dialogue
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
            <Shirt className="h-5 w-5 text-emerald-500" />
            Vêtements de l'utilisateur
          </DialogTitle>
          <DialogDescription>
            Liste des vêtements de {user.email}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Chargement des vêtements...</span>
          </div>
        ) : (
          <div className="py-4">
            {vetements.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Couleur</TableHead>
                    <TableHead>Date d'ajout</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vetements.map((vetement) => (
                    <TableRow key={vetement.id}>
                      <TableCell className="font-medium">{vetement.nom}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{vetement.categorie}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: vetement.couleur.toLowerCase() }}
                          />
                          {vetement.couleur}
                        </div>
                      </TableCell>
                      <TableCell>{vetement.date_ajout}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Shirt className="h-12 w-12 mx-auto mb-2 opacity-20" />
                <p>Aucun vêtement trouvé pour cet utilisateur</p>
              </div>
            )}
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

export default UserVetementsDialog;

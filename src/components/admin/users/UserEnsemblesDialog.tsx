
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { AdminUserData } from '@/services/adminService';
import { Loader2, ShoppingBag, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';

interface UserEnsemblesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: AdminUserData | null;
}

interface Ensemble {
  id: number;
  nom: string;
  occasion: string;
  nb_vetements: number;
  date_creation: string;
}

const UserEnsemblesDialog: React.FC<UserEnsemblesDialogProps> = ({ open, onOpenChange, user }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [ensembles, setEnsembles] = useState<Ensemble[]>([]);

  useEffect(() => {
    const fetchEnsembles = async () => {
      if (user && open) {
        setLoading(true);
        try {
          // Récupérer les ensembles réels depuis Supabase
          const { data: tenues, error: tenuesError } = await supabase
            .from('tenues')
            .select(`
              id,
              nom,
              occasion,
              created_at
            `)
            .eq('user_id', user.id);
          
          if (tenuesError) throw tenuesError;
          
          // Pour chaque tenue, compter le nombre de vêtements associés
          const ensemblesData = await Promise.all(
            tenues.map(async (tenue) => {
              // Récupérer le nombre de vêtements dans cet ensemble
              const { count, error: countError } = await supabase
                .from('tenue_vetements')
                .select('id', { count: 'exact', head: true })
                .eq('tenue_id', tenue.id);
              
              if (countError) throw countError;
              
              return {
                id: tenue.id,
                nom: tenue.nom || 'Ensemble sans nom',
                occasion: tenue.occasion || 'Non spécifié',
                nb_vetements: count || 0,
                date_creation: new Date(tenue.created_at).toLocaleDateString('fr-FR')
              };
            })
          );
          
          setEnsembles(ensemblesData);
        } catch (error) {
          console.error("Erreur lors de la récupération des ensembles:", error);
          toast({
            title: "Erreur",
            description: "Impossible de charger les ensembles de l'utilisateur",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      }
    };

    fetchEnsembles();
    
    // Nettoyage lorsque le dialog est fermé
    return () => {
      if (!open) {
        setEnsembles([]);
      }
    };
  }, [user, open, toast]);

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]" onInteractOutside={(e) => {
        e.preventDefault(); // Empêcher la fermeture au clic extérieur
      }}>
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-purple-500" />
            Ensembles de l'utilisateur
          </DialogTitle>
          <DialogDescription>
            Liste des ensembles créés par {user.email}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Chargement des ensembles...</span>
          </div>
        ) : (
          <div className="py-4">
            {ensembles.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Occasion</TableHead>
                    <TableHead>Nombre de vêtements</TableHead>
                    <TableHead>Date de création</TableHead>
                    <TableHead className="w-[100px]">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ensembles.map((ensemble) => (
                    <TableRow key={ensemble.id}>
                      <TableCell className="font-medium">{ensemble.nom}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{ensemble.occasion}</Badge>
                      </TableCell>
                      <TableCell>{ensemble.nb_vetements}</TableCell>
                      <TableCell>{ensemble.date_creation}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" title="Voir les détails">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <ShoppingBag className="h-12 w-12 mx-auto mb-2 opacity-20" />
                <p>Aucun ensemble trouvé pour cet utilisateur</p>
              </div>
            )}
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

export default UserEnsemblesDialog;

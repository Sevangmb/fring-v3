
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { AdminUserData } from '@/services/adminService';
import { Loader2, ShoppingBag, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface UserEnsemblesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: AdminUserData | null;
}

const mockEnsembles = [
  { id: 1, nom: "Tenue casual", occasion: "Quotidien", nb_vetements: 4, date_creation: "2023-11-10" },
  { id: 2, nom: "Tenue de sport", occasion: "Sport", nb_vetements: 3, date_creation: "2023-10-05" },
  { id: 3, nom: "Soirée élégante", occasion: "Soirée", nb_vetements: 5, date_creation: "2023-09-15" },
  { id: 4, nom: "Look professionnel", occasion: "Travail", nb_vetements: 4, date_creation: "2023-11-20" },
];

const UserEnsemblesDialog: React.FC<UserEnsemblesDialogProps> = ({ open, onOpenChange, user }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [ensembles, setEnsembles] = useState<any[]>([]);

  useEffect(() => {
    const fetchEnsembles = async () => {
      if (user && open) {
        setLoading(true);
        try {
          // Dans une application réelle, nous ferions un appel API ici
          // const response = await getUserEnsembles(user.id);
          // setEnsembles(response);
          
          // Pour cette démo, utilisons des données fictives
          setTimeout(() => {
            setEnsembles(mockEnsembles);
            setLoading(false);
          }, 1000);
        } catch (error) {
          console.error("Erreur lors de la récupération des ensembles:", error);
          toast({
            title: "Erreur",
            description: "Impossible de charger les ensembles de l'utilisateur",
            variant: "destructive",
          });
          setLoading(false);
        }
      }
    };

    fetchEnsembles();
  }, [user, open, toast]);

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
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

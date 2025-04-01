
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { AdminUserData } from '@/services/adminService';
import { Loader2, Shirt } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface UserVetementsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: AdminUserData | null;
}

const mockVetements = [
  { id: 1, nom: "T-shirt noir", categorie: "Haut", couleur: "Noir", date_ajout: "2023-10-15" },
  { id: 2, nom: "Jean slim", categorie: "Bas", couleur: "Bleu", date_ajout: "2023-09-22" },
  { id: 3, nom: "Veste en cuir", categorie: "Veste", couleur: "Marron", date_ajout: "2023-11-05" },
  { id: 4, nom: "Chemise blanche", categorie: "Haut", couleur: "Blanc", date_ajout: "2023-10-30" },
  { id: 5, nom: "Chaussures de sport", categorie: "Chaussures", couleur: "Rouge", date_ajout: "2023-08-17" },
];

const UserVetementsDialog: React.FC<UserVetementsDialogProps> = ({ open, onOpenChange, user }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [vetements, setVetements] = useState<any[]>([]);

  useEffect(() => {
    const fetchVetements = async () => {
      if (user && open) {
        setLoading(true);
        try {
          // Dans une application réelle, nous ferions un appel API ici
          // const response = await getUserVetements(user.id);
          // setVetements(response);
          
          // Pour cette démo, utilisons des données fictives
          setTimeout(() => {
            setVetements(mockVetements);
            setLoading(false);
          }, 1000);
        } catch (error) {
          console.error("Erreur lors de la récupération des vêtements:", error);
          toast({
            title: "Erreur",
            description: "Impossible de charger les vêtements de l'utilisateur",
            variant: "destructive",
          });
          setLoading(false);
        }
      }
    };

    fetchVetements();
  }, [user, open, toast]);

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
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
          <Button onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserVetementsDialog;

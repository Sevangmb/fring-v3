
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Loader2, Plus, Search, Pencil, Trash2 } from 'lucide-react';
import { fetchEnsembles } from '@/services/ensemble';
import { Ensemble } from '@/services/ensemble/types';
import AdminEnsembleDialog from './dialogs/AdminEnsembleDialog';
import { useToast } from '@/hooks/use-toast';
import { deleteEnsemble } from '@/services/ensemble';

const AdminEnsemblesList: React.FC = () => {
  const [ensembles, setEnsembles] = useState<Ensemble[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEnsemble, setSelectedEnsemble] = useState<Ensemble | null>(null);
  const { toast } = useToast();

  // Charger les ensembles
  const loadEnsembles = async () => {
    try {
      setLoading(true);
      const data = await fetchEnsembles();
      setEnsembles(data);
    } catch (error) {
      console.error('Erreur lors du chargement des ensembles:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les ensembles",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnsembles();
  }, []);

  // Filtrer les ensembles en fonction du terme de recherche
  const filteredEnsembles = ensembles.filter(ensemble => 
    ensemble.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (ensemble.description && ensemble.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Ouvrir le dialogue d'édition
  const handleEdit = (ensemble: Ensemble) => {
    setSelectedEnsemble(ensemble);
    setDialogOpen(true);
  };

  // Ouvrir le dialogue de création
  const handleCreate = () => {
    setSelectedEnsemble(null);
    setDialogOpen(true);
  };

  // Gérer la suppression d'un ensemble
  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet ensemble ?')) {
      try {
        await deleteEnsemble(id);
        toast({
          title: "Succès",
          description: "Ensemble supprimé avec succès",
        });
        loadEnsembles();
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'ensemble:', error);
        toast({
          title: "Erreur",
          description: "Impossible de supprimer l'ensemble",
          variant: "destructive"
        });
      }
    }
  };

  // Gérer la fermeture du dialogue
  const handleDialogClose = (shouldRefresh: boolean) => {
    setDialogOpen(false);
    if (shouldRefresh) {
      loadEnsembles();
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Ensembles</CardTitle>
        <Button onClick={handleCreate} className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          Ajouter
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex items-center mb-4">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher des ensembles..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Occasion</TableHead>
                  <TableHead>Saison</TableHead>
                  <TableHead>Date de création</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEnsembles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Aucun ensemble trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEnsembles.map((ensemble) => (
                    <TableRow key={ensemble.id}>
                      <TableCell className="font-medium">{ensemble.nom}</TableCell>
                      <TableCell className="max-w-xs truncate">{ensemble.description || '-'}</TableCell>
                      <TableCell>{ensemble.occasion || '-'}</TableCell>
                      <TableCell>{ensemble.saison || '-'}</TableCell>
                      <TableCell>{new Date(ensemble.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(ensemble)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(ensemble.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      <AdminEnsembleDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        ensemble={selectedEnsemble}
      />
    </Card>
  );
};

export default AdminEnsemblesList;

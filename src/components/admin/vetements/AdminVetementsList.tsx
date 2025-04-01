
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Plus, Search, Tag, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Vetement } from '@/services/vetement/types';
import AdminVetementDialog from './dialogs/AdminVetementDialog';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';
import { getAllVetements } from '@/services/database/statsService';

const AdminVetementsList: React.FC = () => {
  const { toast } = useToast();
  const [vetements, setVetements] = useState<Vetement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentVetement, setCurrentVetement] = useState<Vetement | null>(null);
  const [categories, setCategories] = useState<{id: number, nom: string}[]>([]);

  const fetchVetements = async () => {
    setLoading(true);
    try {
      // Utiliser la nouvelle fonction getAllVetements pour récupérer tous les vêtements
      const data = await getAllVetements();
      
      // Filtrer les résultats si un terme de recherche est spécifié
      const filteredData = searchTerm 
        ? data.filter(v => v.nom.toLowerCase().includes(searchTerm.toLowerCase()))
        : data;
      
      setVetements(filteredData || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des vêtements:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les vêtements",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, nom')
        .order('nom');

      if (error) throw error;
      
      setCategories(data || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories:', error);
    }
  };

  useEffect(() => {
    fetchVetements();
    fetchCategories();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchVetements();
  };

  const handleEdit = (vetement: Vetement) => {
    setCurrentVetement(vetement);
    setDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce vêtement ?')) return;
    
    try {
      const { error } = await supabase
        .from('vetements')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Succès",
        description: "Vêtement supprimé avec succès",
      });
      
      fetchVetements();
    } catch (error) {
      console.error('Erreur lors de la suppression du vêtement:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le vêtement",
        variant: "destructive"
      });
    }
  };

  const handleAddNew = () => {
    setCurrentVetement(null);
    setDialogOpen(true);
  };

  const getCategoryName = (categoryId: number) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.nom : 'Catégorie inconnue';
  };

  const handleDialogClose = (shouldRefresh: boolean) => {
    setDialogOpen(false);
    if (shouldRefresh) {
      fetchVetements();
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium">Liste des vêtements</h3>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={fetchVetements} 
              className="ml-2"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
          <div className="flex gap-3">
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <Input
                placeholder="Rechercher un vêtement..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-64"
              />
              <Button type="submit" variant="outline" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </form>
            <Button onClick={handleAddNew}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="w-full h-12" />
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Taille</TableHead>
                <TableHead>Couleur</TableHead>
                <TableHead>Propriétaire</TableHead>
                <TableHead>Date d'ajout</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vetements.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    Aucun vêtement trouvé
                  </TableCell>
                </TableRow>
              ) : (
                vetements.map((vetement) => (
                  <TableRow key={vetement.id}>
                    <TableCell>
                      {vetement.image_url ? (
                        <div className="w-10 h-10 relative rounded overflow-hidden bg-gray-100">
                          <img 
                            src={vetement.image_url} 
                            alt={vetement.nom}
                            className="w-full h-full object-cover" 
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 bg-gray-100 flex items-center justify-center rounded">
                          <Tag className="h-5 w-5 text-gray-400" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{vetement.nom}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getCategoryName(vetement.categorie_id)}
                      </Badge>
                    </TableCell>
                    <TableCell>{vetement.taille}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: vetement.couleur }}
                        />
                        {vetement.couleur}
                      </div>
                    </TableCell>
                    <TableCell>
                      {(vetement as any).profiles?.email || 'Non assigné'}
                    </TableCell>
                    <TableCell>
                      {vetement.created_at && format(
                        new Date(vetement.created_at),
                        'dd MMM yyyy',
                        { locale: fr }
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          onClick={() => handleEdit(vetement)} 
                          variant="outline" 
                          size="icon"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          onClick={() => handleDelete(vetement.id)} 
                          variant="destructive" 
                          size="icon"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
        
        <AdminVetementDialog 
          open={dialogOpen} 
          onOpenChange={handleDialogClose}
          vetement={currentVetement}
          categories={categories}
        />
      </CardContent>
    </Card>
  );
};

export default AdminVetementsList;

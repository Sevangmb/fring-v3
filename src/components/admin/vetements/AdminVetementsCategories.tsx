
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Plus, Search, Tag, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import AdminCategorieDialog from './dialogs/AdminCategorieDialog';
import { Skeleton } from '@/components/ui/skeleton';

interface Categorie {
  id: number;
  nom: string;
  description: string | null;
}

const AdminVetementsCategories: React.FC = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentCategorie, setCurrentCategorie] = useState<Categorie | null>(null);
  const [vetementsCounts, setVetementsCounts] = useState<Record<number, number>>({});

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .ilike('nom', `%${searchTerm}%`)
        .order('nom');

      if (error) throw error;
      
      setCategories(data || []);
      fetchVetementsCount(data || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les catégories",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchVetementsCount = async (categories: Categorie[]) => {
    const counts: Record<number, number> = {};
    
    for (const category of categories) {
      try {
        const { count, error } = await supabase
          .from('vetements')
          .select('*', { count: 'exact', head: true })
          .eq('categorie_id', category.id);
        
        if (error) throw error;
        
        counts[category.id] = count || 0;
      } catch (error) {
        console.error(`Erreur lors du comptage des vêtements pour la catégorie ${category.id}:`, error);
        counts[category.id] = 0;
      }
    }
    
    setVetementsCounts(counts);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCategories();
  };

  const handleEdit = (categorie: Categorie) => {
    setCurrentCategorie(categorie);
    setDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    // Vérifier d'abord si des vêtements sont associés à cette catégorie
    if (vetementsCounts[id] > 0) {
      toast({
        title: "Action impossible",
        description: `Cette catégorie contient ${vetementsCounts[id]} vêtement(s). Veuillez les réassigner avant de supprimer.`,
        variant: "destructive"
      });
      return;
    }
    
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) return;
    
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Succès",
        description: "Catégorie supprimée avec succès",
      });
      
      fetchCategories();
    } catch (error) {
      console.error('Erreur lors de la suppression de la catégorie:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la catégorie",
        variant: "destructive"
      });
    }
  };

  const handleAddNew = () => {
    setCurrentCategorie(null);
    setDialogOpen(true);
  };

  const handleDialogClose = (shouldRefresh: boolean) => {
    setDialogOpen(false);
    if (shouldRefresh) {
      fetchCategories();
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium">Liste des catégories</h3>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={fetchCategories} 
              className="ml-2"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
          <div className="flex gap-3">
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <Input
                placeholder="Rechercher une catégorie..."
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
                <TableHead>Nom</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Vêtements associés</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    Aucune catégorie trouvée
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((categorie) => (
                  <TableRow key={categorie.id}>
                    <TableCell className="font-medium flex items-center">
                      <Tag className="h-4 w-4 mr-2 text-primary" />
                      {categorie.nom}
                    </TableCell>
                    <TableCell>{categorie.description || '-'}</TableCell>
                    <TableCell>{vetementsCounts[categorie.id] || 0}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          onClick={() => handleEdit(categorie)} 
                          variant="outline" 
                          size="icon"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          onClick={() => handleDelete(categorie.id)} 
                          variant="destructive" 
                          size="icon"
                          disabled={vetementsCounts[categorie.id] > 0}
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
        
        <AdminCategorieDialog 
          open={dialogOpen} 
          onOpenChange={handleDialogClose}
          categorie={currentCategorie}
        />
      </CardContent>
    </Card>
  );
};

export default AdminVetementsCategories;

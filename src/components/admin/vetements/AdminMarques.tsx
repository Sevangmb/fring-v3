
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Plus, Search, Store, RefreshCw, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import AdminMarqueDialog from './dialogs/AdminMarqueDialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

interface Marque {
  id: number;
  nom: string;
  logo_url: string | null;
  site_web: string | null;
}

const AdminMarques: React.FC = () => {
  const { toast } = useToast();
  const [marques, setMarques] = useState<Marque[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentMarque, setCurrentMarque] = useState<Marque | null>(null);
  const [vetementsCounts, setVetementsCounts] = useState<Record<number, number>>({});

  const fetchMarques = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('marques')
        .select('*')
        .ilike('nom', `%${searchTerm}%`)
        .order('nom');

      if (error) throw error;
      
      setMarques(data || []);
      fetchVetementsCount(data || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des marques:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les marques",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchVetementsCount = async (marques: Marque[]) => {
    const counts: Record<number, number> = {};
    
    for (const marque of marques) {
      try {
        const { count, error } = await supabase
          .from('vetements')
          .select('*', { count: 'exact', head: true })
          .eq('marque', marque.nom);
        
        if (error) throw error;
        
        counts[marque.id] = count || 0;
      } catch (error) {
        console.error(`Erreur lors du comptage des vêtements pour la marque ${marque.id}:`, error);
        counts[marque.id] = 0;
      }
    }
    
    setVetementsCounts(counts);
  };

  useEffect(() => {
    fetchMarques();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMarques();
  };

  const handleEdit = (marque: Marque) => {
    setCurrentMarque(marque);
    setDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    // Vérifier d'abord si des vêtements sont associés à cette marque
    if (vetementsCounts[id] > 0) {
      toast({
        title: "Action impossible",
        description: `Cette marque est utilisée par ${vetementsCounts[id]} vêtement(s). Veuillez les réassigner avant de supprimer.`,
        variant: "destructive"
      });
      return;
    }
    
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette marque ?')) return;
    
    try {
      const { error } = await supabase
        .from('marques')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Succès",
        description: "Marque supprimée avec succès",
      });
      
      fetchMarques();
    } catch (error) {
      console.error('Erreur lors de la suppression de la marque:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la marque",
        variant: "destructive"
      });
    }
  };

  const handleAddNew = () => {
    setCurrentMarque(null);
    setDialogOpen(true);
  };

  const handleDialogClose = (shouldRefresh: boolean) => {
    setDialogOpen(false);
    if (shouldRefresh) {
      fetchMarques();
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium">Liste des marques</h3>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={fetchMarques} 
              className="ml-2"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
          <div className="flex gap-3">
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <Input
                placeholder="Rechercher une marque..."
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
                <TableHead>Logo</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Site web</TableHead>
                <TableHead>Vêtements associés</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {marques.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Aucune marque trouvée
                  </TableCell>
                </TableRow>
              ) : (
                marques.map((marque) => (
                  <TableRow key={marque.id}>
                    <TableCell>
                      {marque.logo_url ? (
                        <div className="w-10 h-10 relative rounded overflow-hidden bg-gray-100">
                          <img 
                            src={marque.logo_url} 
                            alt={marque.nom}
                            className="w-full h-full object-contain" 
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 bg-gray-100 flex items-center justify-center rounded">
                          <Store className="h-5 w-5 text-gray-400" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        {marque.nom}
                      </div>
                    </TableCell>
                    <TableCell>
                      {marque.site_web ? (
                        <a
                          href={marque.site_web}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-blue-600 hover:underline"
                        >
                          {marque.site_web}
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {vetementsCounts[marque.id] || 0}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          onClick={() => handleEdit(marque)} 
                          variant="outline" 
                          size="icon"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          onClick={() => handleDelete(marque.id)} 
                          variant="destructive" 
                          size="icon"
                          disabled={vetementsCounts[marque.id] > 0}
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
        
        <AdminMarqueDialog 
          open={dialogOpen} 
          onOpenChange={handleDialogClose}
          marque={currentMarque}
        />
      </CardContent>
    </Card>
  );
};

export default AdminMarques;

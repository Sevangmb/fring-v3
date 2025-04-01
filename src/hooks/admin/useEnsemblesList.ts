
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Ensemble } from '@/services/ensemble/types';

export const useEnsemblesList = () => {
  const { toast } = useToast();
  const [ensembles, setEnsembles] = useState<Ensemble[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentEnsemble, setCurrentEnsemble] = useState<Ensemble | null>(null);

  const fetchEnsembles = async () => {
    setLoading(true);
    try {
      // Récupérer tous les ensembles de tous les utilisateurs
      const { data, error } = await supabase
        .from('tenues')
        .select(`
          *,
          profiles:user_id(email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Filtrer les résultats si un terme de recherche est spécifié
      const filteredData = searchTerm 
        ? data.filter(v => v.nom.toLowerCase().includes(searchTerm.toLowerCase()))
        : data;
      
      setEnsembles(filteredData || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des ensembles:', error);
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
    fetchEnsembles();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchEnsembles();
  };

  const handleEdit = (ensemble: Ensemble) => {
    setCurrentEnsemble(ensemble);
    setDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet ensemble ?')) return;
    
    try {
      const { error } = await supabase
        .from('tenues')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Succès",
        description: "Ensemble supprimé avec succès",
      });
      
      fetchEnsembles();
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'ensemble:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'ensemble",
        variant: "destructive"
      });
    }
  };

  const handleAddNew = () => {
    setCurrentEnsemble(null);
    setDialogOpen(true);
  };

  const handleDialogClose = (shouldRefresh: boolean) => {
    setDialogOpen(false);
    if (shouldRefresh) {
      fetchEnsembles();
    }
  };

  return {
    ensembles,
    loading,
    searchTerm,
    dialogOpen,
    currentEnsemble,
    fetchEnsembles,
    handleSearchChange,
    handleSearchSubmit,
    handleEdit,
    handleDelete,
    handleAddNew,
    handleDialogClose
  };
};

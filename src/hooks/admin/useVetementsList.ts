
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Vetement } from '@/services/vetement/types';
import { getAllVetements } from '@/services/database/statsService';

export const useVetementsList = () => {
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
      // Utiliser la fonction getAllVetements pour récupérer tous les vêtements
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

  const handleDialogClose = (shouldRefresh: boolean) => {
    setDialogOpen(false);
    if (shouldRefresh) {
      fetchVetements();
    }
  };

  return {
    vetements,
    loading,
    searchTerm,
    dialogOpen,
    currentVetement,
    categories,
    fetchVetements,
    handleSearchChange,
    handleSearchSubmit,
    handleEdit,
    handleDelete,
    handleAddNew,
    handleDialogClose
  };
};

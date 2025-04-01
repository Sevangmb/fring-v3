
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export type News = {
  id: number;
  title: string;
  date: string;
  content: string;
  created_at: string;
};

export const useNewsList = () => {
  const { toast } = useToast();
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentNews, setCurrentNews] = useState<News | null>(null);

  const fetchNews = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (searchTerm) {
        query = query.ilike('title', `%${searchTerm}%`);
      }
      
      const { data, error } = await query;

      if (error) throw error;
      
      setNews(data || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des actualités:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les actualités",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchNews();
  };

  const handleEdit = (news: News) => {
    setCurrentNews(news);
    setDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette actualité ?')) return;
    
    try {
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Succès",
        description: "Actualité supprimée avec succès",
      });
      
      fetchNews();
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'actualité:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'actualité",
        variant: "destructive"
      });
    }
  };

  const handleAddNew = () => {
    setCurrentNews(null);
    setDialogOpen(true);
  };

  const handleDialogClose = (shouldRefresh: boolean) => {
    setDialogOpen(false);
    if (shouldRefresh) {
      fetchNews();
    }
  };

  return {
    news,
    loading,
    searchTerm,
    dialogOpen,
    currentNews,
    fetchNews,
    handleSearchChange,
    handleSearchSubmit,
    handleEdit,
    handleDelete,
    handleAddNew,
    handleDialogClose
  };
};

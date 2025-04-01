
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { News } from '@/hooks/admin/useNewsList';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface AdminNewsDialogProps {
  open: boolean;
  onOpenChange: (shouldRefresh: boolean) => void;
  news: News | null;
}

const AdminNewsDialog: React.FC<AdminNewsDialogProps> = ({
  open,
  onOpenChange,
  news
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (news) {
      setTitle(news.title);
      setDate(news.date);
      setContent(news.content);
    } else {
      setTitle('');
      // Définir la date d'aujourd'hui par défaut
      const today = new Date();
      const formattedDate = `${today.getDate()} ${today.toLocaleString('fr-FR', { month: 'long' })} ${today.getFullYear()}`;
      setDate(formattedDate);
      setContent('');
    }
  }, [news, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!title || !date || !content) {
        toast({
          title: "Erreur",
          description: "Tous les champs sont obligatoires",
          variant: "destructive"
        });
        return;
      }

      if (news) {
        // Mise à jour d'une actualité existante
        const { error } = await supabase
          .from('news')
          .update({
            title,
            date,
            content
          })
          .eq('id', news.id);

        if (error) throw error;

        toast({
          title: "Succès",
          description: "Actualité mise à jour avec succès",
        });
      } else {
        // Création d'une nouvelle actualité
        const { error } = await supabase
          .from('news')
          .insert([
            {
              title,
              date,
              content
            }
          ]);

        if (error) throw error;

        toast({
          title: "Succès",
          description: "Actualité ajoutée avec succès",
        });
      }

      // Fermer le dialogue et rafraîchir les données
      onOpenChange(true);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder l'actualité",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onOpenChange(false)}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {news ? "Modifier l'actualité" : "Ajouter une actualité"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Titre</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre de l'actualité"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="ex: 15 juin 2023"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="content">Contenu</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Contenu de l'actualité"
              className="min-h-[200px]"
              required
            />
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "En cours..." : news ? "Mettre à jour" : "Ajouter"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminNewsDialog;

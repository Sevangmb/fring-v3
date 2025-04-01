
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
import { Calendar } from 'lucide-react';

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
  const [formErrors, setFormErrors] = useState<{
    title?: string;
    date?: string;
    content?: string;
  }>({});

  useEffect(() => {
    if (news) {
      setTitle(news.title);
      setDate(news.date);
      setContent(news.content);
      setFormErrors({});
    } else {
      setTitle('');
      // Définir la date d'aujourd'hui par défaut
      const today = new Date();
      const formattedDate = `${today.getDate()} ${today.toLocaleString('fr-FR', { month: 'long' })} ${today.getFullYear()}`;
      setDate(formattedDate);
      setContent('');
      setFormErrors({});
    }
  }, [news, open]);

  const validateForm = () => {
    const errors: {
      title?: string;
      date?: string;
      content?: string;
    } = {};
    let isValid = true;

    if (!title.trim()) {
      errors.title = "Le titre est obligatoire";
      isValid = false;
    }

    if (!date.trim()) {
      errors.date = "La date est obligatoire";
      isValid = false;
    }

    if (!content.trim()) {
      errors.content = "Le contenu est obligatoire";
      isValid = false;
    } else if (content.length < 10) {
      errors.content = "Le contenu doit contenir au moins 10 caractères";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);

    try {
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

  const handleDateFormat = () => {
    try {
      // Si la date est au format ISO, la convertir en format français
      if (/^\d{4}-\d{2}-\d{2}/.test(date)) {
        const dateObj = new Date(date);
        const formattedDate = `${dateObj.getDate()} ${dateObj.toLocaleString('fr-FR', { month: 'long' })} ${dateObj.getFullYear()}`;
        setDate(formattedDate);
      }
    } catch (error) {
      console.error('Erreur de formatage de date:', error);
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
              className={formErrors.title ? "border-red-500" : ""}
            />
            {formErrors.title && (
              <p className="text-sm text-red-500">{formErrors.title}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="date" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Date
            </Label>
            <Input
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              onBlur={handleDateFormat}
              placeholder="ex: 15 juin 2023"
              className={formErrors.date ? "border-red-500" : ""}
            />
            {formErrors.date && (
              <p className="text-sm text-red-500">{formErrors.date}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Format recommandé: 15 juin 2023
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="content">Contenu</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Contenu de l'actualité"
              className={`min-h-[200px] ${formErrors.content ? "border-red-500" : ""}`}
            />
            {formErrors.content && (
              <p className="text-sm text-red-500">{formErrors.content}</p>
            )}
            <div className="flex justify-between">
              <p className="text-xs text-muted-foreground">
                Minimum 10 caractères
              </p>
              <p className="text-xs text-muted-foreground">
                {content.length} caractères
              </p>
            </div>
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


import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

export interface Defi {
  id: number;
  titre: string;
  description: string;
  date_debut: string;
  date_fin: string;
  user_id?: string;
  participants_count: number;
  status: 'current' | 'upcoming' | 'past';
  created_at: string;
}

export type DefiFormData = {
  titre: string;
  description: string;
  dateDebut: string;
  dateFin: string;
};

/**
 * Crée un nouveau défi dans la base de données
 */
export const createDefi = async (defiData: DefiFormData): Promise<Defi | null> => {
  try {
    // Vérifier si l'utilisateur est connecté
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;
    
    if (!userId) {
      toast({
        title: "Non authentifié",
        description: "Vous devez être connecté pour créer un défi",
        variant: "destructive"
      });
      return null;
    }
    
    // Déterminer le statut du défi basé sur les dates
    const today = new Date();
    const dateDebut = new Date(defiData.dateDebut);
    const dateFin = new Date(defiData.dateFin);
    
    let status: 'current' | 'upcoming' | 'past' = 'current';
    if (dateDebut > today) {
      status = 'upcoming';
    } else if (dateFin < today) {
      status = 'past';
    }
    
    // Insérer le défi dans la base de données
    const { data, error } = await supabase
      .from('defis')
      .insert([{
        titre: defiData.titre,
        description: defiData.description,
        date_debut: defiData.dateDebut,
        date_fin: defiData.dateFin,
        user_id: userId,
        status: status
      }])
      .select()
      .single();
    
    if (error) {
      console.error("Erreur lors de la création du défi:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création du défi",
        variant: "destructive"
      });
      return null;
    }
    
    toast({
      title: "Succès",
      description: "Le défi a été créé avec succès",
    });
    
    return data as Defi;
  } catch (error) {
    console.error("Erreur lors de la création du défi:", error);
    toast({
      title: "Erreur",
      description: "Une erreur est survenue lors de la création du défi",
      variant: "destructive"
    });
    return null;
  }
};

/**
 * Récupère les défis en fonction de leur statut
 */
export const getDefisByStatus = async (status: 'current' | 'upcoming' | 'past'): Promise<Defi[]> => {
  try {
    const { data, error } = await supabase
      .from('defis')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Erreur lors de la récupération des défis:", error);
      return [];
    }
    
    return data as Defi[];
  } catch (error) {
    console.error("Erreur lors de la récupération des défis:", error);
    return [];
  }
};

/**
 * Met à jour automatiquement le statut des défis en fonction des dates
 */
export const updateDefisStatus = async (): Promise<boolean> => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // Mettre à jour les défis passés
    const { error: pastError } = await supabase
      .from('defis')
      .update({ status: 'past' })
      .lt('date_fin', today)
      .not('status', 'eq', 'past');
    
    if (pastError) {
      console.error("Erreur lors de la mise à jour des défis passés:", pastError);
    }
    
    // Mettre à jour les défis en cours
    const { error: currentError } = await supabase
      .from('defis')
      .update({ status: 'current' })
      .lte('date_debut', today)
      .gte('date_fin', today)
      .not('status', 'eq', 'current');
    
    if (currentError) {
      console.error("Erreur lors de la mise à jour des défis en cours:", currentError);
    }
    
    // Mettre à jour les défis à venir
    const { error: upcomingError } = await supabase
      .from('defis')
      .update({ status: 'upcoming' })
      .gt('date_debut', today)
      .not('status', 'eq', 'upcoming');
    
    if (upcomingError) {
      console.error("Erreur lors de la mise à jour des défis à venir:", upcomingError);
    }
    
    return true;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut des défis:", error);
    return false;
  }
};

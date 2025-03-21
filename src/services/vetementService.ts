
import { supabase } from '@/lib/supabase';

// Type pour un vêtement
export interface Vetement {
  id: number;
  nom: string;
  categorie: string;
  couleur: string;
  taille: string;
  description?: string;
  marque?: string;
  image_url?: string;
  created_at: string;
  user_id?: string;
}

// Fonction pour récupérer tous les vêtements de l'utilisateur connecté
export const fetchVetements = async (): Promise<Vetement[]> => {
  try {
    // Récupérer la session utilisateur
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;

    // Si pas d'utilisateur connecté, renvoyer un tableau vide
    if (!userId) {
      console.warn('Aucun utilisateur connecté. Retour de données vides.');
      return [];
    }

    console.log('Récupération des vêtements pour l\'utilisateur:', userId);

    const { data, error } = await supabase
      .from('vetements')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Erreur lors de la récupération des vêtements:', error);
      throw error;
    }
    
    console.log('Vêtements récupérés:', data);
    
    // Si aucune donnée n'est retournée, la table est peut-être vide pour cet utilisateur
    if (!data || data.length === 0) {
      console.log('Aucun vêtement trouvé pour cet utilisateur, ajout de données de démo');
      // Insérer des données de démo pour l'utilisateur connecté
      try {
        const { error: insertError } = await supabase
          .from('vetements')
          .insert(demoVetements.map(v => ({...v, user_id: userId})));
        
        if (insertError) {
          console.error('Erreur lors de l\'insertion des données de démo:', insertError);
          return [];
        }
        
        // Réessayer de récupérer les données après insertion
        const { data: refreshedData, error: refreshError } = await supabase
          .from('vetements')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
        
        if (refreshError) {
          console.error('Erreur lors de la récupération après insertion:', refreshError);
          return [];
        }
        
        console.log('Données de démo insérées et récupérées:', refreshedData);
        return refreshedData as Vetement[] || [];
      } catch (insertCatchError) {
        console.error('Exception lors de l\'insertion des données de démo:', insertCatchError);
        return [];
      }
    }
    
    return data as Vetement[];
  } catch (error) {
    console.error('Erreur lors de la récupération des vêtements:', error);
    throw error;
  }
};

// Fonction pour ajouter un vêtement
export const addVetement = async (vetement: Omit<Vetement, 'id' | 'created_at' | 'user_id'>): Promise<Vetement> => {
  try {
    // Récupérer l'ID de l'utilisateur connecté
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;

    if (!userId) {
      throw new Error('Vous devez être connecté pour ajouter un vêtement');
    }

    console.log('Ajout d\'un vêtement pour l\'utilisateur:', userId, vetement);

    const { data, error } = await supabase
      .from('vetements')
      .insert([{ ...vetement, user_id: userId }])
      .select()
      .single();
    
    if (error) {
      console.error('Erreur lors de l\'ajout d\'un vêtement:', error);
      throw error;
    }
    
    console.log('Vêtement ajouté avec succès:', data);
    return data as Vetement;
  } catch (error) {
    console.error('Erreur lors de l\'ajout d\'un vêtement:', error);
    throw error;
  }
};

// Fonction pour supprimer un vêtement
export const deleteVetement = async (id: number): Promise<void> => {
  try {
    console.log('Tentative de suppression du vêtement ID:', id);
    const { error } = await supabase
      .from('vetements')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Erreur lors de la suppression d\'un vêtement:', error);
      throw error;
    }
    console.log('Vêtement supprimé avec succès');
  } catch (error) {
    console.error('Erreur lors de la suppression d\'un vêtement:', error);
    throw error;
  }
};

// Fonction pour mettre à jour un vêtement
export const updateVetement = async (id: number, updates: Partial<Vetement>): Promise<Vetement> => {
  try {
    // Supprimer user_id des mises à jour si présent pour éviter de changer le propriétaire
    const { user_id, ...updateData } = updates;
    
    const { data, error } = await supabase
      .from('vetements')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Erreur lors de la mise à jour d\'un vêtement:', error);
      throw error;
    }
    
    return data as Vetement;
  } catch (error) {
    console.error('Erreur lors de la mise à jour d\'un vêtement:', error);
    throw error;
  }
};

// Données de démo pour le développement
export const demoVetements: Omit<Vetement, 'id' | 'created_at' | 'user_id'>[] = [
  {
    nom: "T-shirt blanc",
    categorie: "t-shirt",
    couleur: "blanc",
    taille: "M",
    marque: "Nike",
    description: "T-shirt basique en coton bio",
  },
  {
    nom: "Jean bleu",
    categorie: "jeans",
    couleur: "bleu",
    taille: "40",
    marque: "Levi's",
    description: "Jean slim en denim stretch",
  },
  {
    nom: "Veste noire",
    categorie: "veste",
    couleur: "noir",
    taille: "L",
    marque: "Zara",
    description: "Veste légère pour la mi-saison",
  },
  {
    nom: "Pull gris",
    categorie: "pull",
    couleur: "gris",
    taille: "S",
    marque: "H&M",
    description: "Pull chaud en laine mélangée",
  },
  {
    nom: "Chemise à carreaux",
    categorie: "chemise",
    couleur: "multicolore",
    taille: "M",
    marque: "Gap",
    description: "Chemise en flanelle pour l'automne",
  },
  {
    nom: "Short beige",
    categorie: "short",
    couleur: "beige",
    taille: "M",
    marque: "Uniqlo",
    description: "Short en coton léger pour l'été",
  },
  {
    nom: "T-shirt jaune",
    categorie: "t-shirt",
    couleur: "jaune",
    taille: "L",
    marque: "Adidas",
    description: "T-shirt sport en matière respirante",
  },
];

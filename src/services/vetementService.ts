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
  owner_email?: string;
}

// Fonction pour récupérer tous les vêtements de l'utilisateur connecté
export const fetchVetements = async (): Promise<Vetement[]> => {
  try {
    // Récupérer la session utilisateur pour vérifier l'authentification
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;

    // Si pas d'utilisateur connecté, renvoyer un tableau vide
    if (!userId) {
      console.warn('Aucun utilisateur connecté. Retour de données vides.');
      return [];
    }

    console.log('Récupération des vêtements pour l\'utilisateur:', userId);

    // Explicitement filtrer par user_id pour s'assurer que seuls les vêtements de l'utilisateur sont retournés
    // Même si RLS est en place, cette contrainte supplémentaire renforce la sécurité
    const { data, error } = await supabase
      .from('vetements')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Erreur lors de la récupération des vêtements:', error);
      throw error;
    }
    
    console.log('Vêtements récupérés:', data?.length || 0);
    return data as Vetement[] || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des vêtements:', error);
    throw error;
  }
};

// Fonction pour récupérer les vêtements des amis
export const fetchVetementsAmis = async (): Promise<Vetement[]> => {
  try {
    // Récupérer la session utilisateur pour vérifier l'authentification
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;

    // Si pas d'utilisateur connecté, renvoyer un tableau vide
    if (!userId) {
      console.warn('Aucun utilisateur connecté. Retour de données vides.');
      return [];
    }

    console.log('Récupération des vêtements des amis pour l\'utilisateur:', userId);

    // Utiliser une procédure RPC pour récupérer les vêtements des amis avec les emails
    const { data, error } = await supabase.rpc('get_friends_vetements');
    
    if (error) {
      console.error('Erreur lors de la récupération des vêtements des amis:', error);
      throw error;
    }
    
    console.log('Vêtements des amis récupérés:', data?.length || 0);
    return data as Vetement[] || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des vêtements des amis:', error);
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

    console.log('Ajout d\'un vêtement pour l\'utilisateur:', userId);

    // Ajouter le user_id aux données du vêtement
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
    // La politique RLS s'assurera que l'utilisateur ne peut supprimer que ses propres vêtements
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
    
    // La politique RLS s'assurera que l'utilisateur ne peut mettre à jour que ses propres vêtements
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

// Fonction pour créer des vêtements de démo pour un nouvel utilisateur
export const createDemoVetementsForUser = async (): Promise<boolean> => {
  try {
    // Récupérer la session utilisateur
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;

    if (!userId) {
      console.warn('Aucun utilisateur connecté. Impossible de créer des vêtements de démo.');
      return false;
    }

    console.log('Création de vêtements de démo pour l\'utilisateur:', userId);

    // Utiliser les données de démo existantes
    const vetementsToInsert = demoVetements.map(vetement => ({
      ...vetement,
      user_id: userId
    }));

    // Insérer les vêtements de démo
    const { error } = await supabase
      .from('vetements')
      .insert(vetementsToInsert);

    if (error) {
      console.error('Erreur lors de la création des vêtements de démo:', error);
      return false;
    }

    console.log('Vêtements de démo créés avec succès');
    return true;
  } catch (error) {
    console.error('Erreur lors de la création des vêtements de démo:', error);
    return false;
  }
};

// Données de démo pour le développement - utilisées pour créer des vêtements pour un nouvel utilisateur
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

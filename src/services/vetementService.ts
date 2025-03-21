
import { supabase } from '@/lib/supabase';

// Interface pour les vêtements
export interface Vetement {
  id: number;
  nom: string;
  categorie: string;
  couleur: string;
  taille: string;
  description?: string;
  marque?: string;
  image_url?: string;
  created_at?: string;
  user_id?: string;
  owner_email?: string;
}

// Fonction pour récupérer tous les vêtements de l'utilisateur connecté
export const fetchVetements = async (): Promise<Vetement[]> => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;

    if (!userId) {
      console.error('Utilisateur non connecté');
      return [];
    }

    const { data, error } = await supabase
      .from('vetements')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur lors de la récupération des vêtements:', error);
      throw error;
    }

    return data as Vetement[];
  } catch (error) {
    console.error('Erreur lors de la récupération des vêtements:', error);
    throw error;
  }
};

// Fonction pour récupérer les vêtements des amis de l'utilisateur connecté
export const fetchVetementsAmis = async (): Promise<Vetement[]> => {
  try {
    // Utiliser la fonction RPC pour récupérer les vêtements des amis
    const { data, error } = await supabase
      .rpc('get_friends_vetements');
    
    if (error) {
      console.error('Erreur lors de la récupération des vêtements des amis:', error);
      throw error;
    }
    
    return data as Vetement[];
  } catch (error) {
    console.error('Erreur lors de la récupération des vêtements des amis:', error);
    return [];
  }
};

// Fonction pour ajouter un vêtement
export const addVetement = async (vetement: Omit<Vetement, 'id' | 'created_at'>): Promise<Vetement> => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;

    if (!userId) {
      throw new Error('Vous devez être connecté pour ajouter un vêtement');
    }

    const { data, error } = await supabase
      .from('vetements')
      .insert([{ ...vetement, user_id: userId }])
      .select()
      .single();
    
    if (error) {
      console.error('Erreur lors de l\'ajout d\'un vêtement:', error);
      throw error;
    }
    
    return data as Vetement;
  } catch (error) {
    console.error('Erreur lors de l\'ajout d\'un vêtement:', error);
    throw error;
  }
};

// Fonction pour mettre à jour un vêtement
export const updateVetement = async (id: number, vetement: Partial<Vetement>): Promise<Vetement> => {
  try {
    const { data, error } = await supabase
      .from('vetements')
      .update(vetement)
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

// Fonction pour supprimer un vêtement
export const deleteVetement = async (id: number): Promise<void> => {
  try {
    const { error } = await supabase
      .from('vetements')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Erreur lors de la suppression d\'un vêtement:', error);
      throw error;
    }
  } catch (error) {
    console.error('Erreur lors de la suppression d\'un vêtement:', error);
    throw error;
  }
};

// Fonction pour créer des vêtements de démo pour un nouvel utilisateur
export const createDemoVetementsForUser = async (): Promise<boolean> => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;

    if (!userId) {
      console.error('Utilisateur non connecté');
      return false;
    }

    // Vérifier si l'utilisateur a déjà des vêtements
    const { data: countData, error: countError } = await supabase
      .rpc('check_user_has_vetements', { user_id_param: userId });
    
    if (countError) {
      console.error('Erreur lors de la vérification des vêtements:', countError);
      return false;
    }
    
    // Si l'utilisateur a déjà des vêtements, ne rien faire
    if (countData && countData > 0) {
      console.log('L\'utilisateur a déjà des vêtements, pas besoin d\'ajouter des démos');
      return false;
    }
    
    console.log('Ajout de vêtements de démo pour l\'utilisateur:', userId);
    
    // Données de démo à ajouter
    const demoVetements = [
      {
        nom: 'T-shirt blanc',
        categorie: 't-shirt',
        couleur: 'blanc',
        taille: 'M',
        description: 'T-shirt basique en coton bio',
        marque: 'Nike',
        user_id: userId
      },
      {
        nom: 'Jean bleu',
        categorie: 'jeans',
        couleur: 'bleu',
        taille: '40',
        description: 'Jean slim en denim stretch',
        marque: 'Levi\'s',
        user_id: userId
      },
      {
        nom: 'Veste noire',
        categorie: 'veste',
        couleur: 'noir',
        taille: 'L',
        description: 'Veste légère pour la mi-saison',
        marque: 'Zara',
        user_id: userId
      },
      {
        nom: 'Pull gris',
        categorie: 'pull',
        couleur: 'gris',
        taille: 'S',
        description: 'Pull chaud en laine mélangée',
        marque: 'H&M',
        user_id: userId
      }
    ];
    
    // Insérer les vêtements de démo
    const { error } = await supabase
      .from('vetements')
      .insert(demoVetements);
    
    if (error) {
      console.error('Erreur lors de l\'ajout des vêtements de démo:', error);
      return false;
    }
    
    console.log('Vêtements de démo ajoutés avec succès');
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'ajout des vêtements de démo:', error);
    return false;
  }
};

// Exporter la fonction deleteVetement par défaut (pour la compatibilité)
export default deleteVetement;

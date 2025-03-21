
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
}

// Fonction pour créer la table vetements si elle n'existe pas
export const initializeDatabase = async () => {
  try {
    // Vérifie si la table existe déjà
    const { data, error } = await supabase
      .from('vetements')
      .select('*')
      .limit(1);
    
    if (error && error.code === '42P01') {
      console.log('La table vetements n\'existe pas. Création en cours...');
      
      // Crée la table si elle n'existe pas
      // Note: Normalement, cela devrait être fait via l'interface Supabase
      // Cette approche est utilisée à des fins de démonstration
      const { error: createError } = await supabase.rpc('create_vetements_table');
      
      if (createError) {
        console.error('Erreur lors de la création de la table:', createError);
        // Fallback pour les données de développement
        return false;
      }
      
      console.log('Table vetements créée avec succès!');
      return true;
    } else {
      console.log('La table vetements existe déjà.');
      return true;
    }
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de la base de données:', error);
    return false;
  }
};

// Fonction pour récupérer tous les vêtements
export const fetchVetements = async (): Promise<Vetement[]> => {
  try {
    const { data, error } = await supabase
      .from('vetements')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data as Vetement[] || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des vêtements:', error);
    throw error;
  }
};

// Fonction pour ajouter un vêtement
export const addVetement = async (vetement: Omit<Vetement, 'id' | 'created_at'>): Promise<Vetement> => {
  try {
    const { data, error } = await supabase
      .from('vetements')
      .insert([vetement])
      .select()
      .single();
    
    if (error) throw error;
    
    return data as Vetement;
  } catch (error) {
    console.error('Erreur lors de l\'ajout d\'un vêtement:', error);
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
    
    if (error) throw error;
  } catch (error) {
    console.error('Erreur lors de la suppression d\'un vêtement:', error);
    throw error;
  }
};

// Fonction pour mettre à jour un vêtement
export const updateVetement = async (id: number, updates: Partial<Vetement>): Promise<Vetement> => {
  try {
    const { data, error } = await supabase
      .from('vetements')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return data as Vetement;
  } catch (error) {
    console.error('Erreur lors de la mise à jour d\'un vêtement:', error);
    throw error;
  }
};

// Fonction pour créer la procédure stockée qui crée la table
export const createStoredProcedure = async () => {
  try {
    const { error } = await supabase.rpc('create_stored_procedure');
    
    if (error) {
      console.error('Erreur lors de la création de la procédure stockée:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Erreur lors de la création de la procédure stockée:', error);
    return false;
  }
};

// Données de démo pour le développement
export const demoVetements: Omit<Vetement, 'id' | 'created_at'>[] = [
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
];

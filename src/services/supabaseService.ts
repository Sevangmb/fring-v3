
import { supabase } from '@/integrations/supabase/client';

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

// Type pour une catégorie
export interface Categorie {
  id: number;
  nom: string;
  description?: string;
  created_at: string;
}

// Type pour une marque
export interface Marque {
  id: number;
  nom: string;
  site_web?: string;
  logo_url?: string;
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
    
    if (error && error.code === '42P01') { // Table doesn't exist
      console.log('La table vetements n\'existe pas. Création en cours...');
      
      // Créer la table directement avec l'API Supabase
      const { error: createError } = await supabase.rpc(
        'create_table',
        {
          table_name: 'vetements',
          columns: `
            id SERIAL PRIMARY KEY,
            nom VARCHAR(255) NOT NULL,
            categorie VARCHAR(50) NOT NULL,
            couleur VARCHAR(50) NOT NULL,
            taille VARCHAR(20) NOT NULL,
            description TEXT,
            marque VARCHAR(100),
            image_url TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
          `
        }
      );
      
      if (createError) {
        console.error('Erreur lors de la création de la table:', createError);
        
        // Si nous ne pouvons pas créer dynamiquement, avertir l'utilisateur
        console.log('Impossible de créer la table automatiquement. Utilisation des données de démo.');
        return false;
      }
      
      console.log('Table vetements créée avec succès!');
      
      // Ajouter quelques données de démo
      const { error: insertError } = await supabase
        .from('vetements')
        .insert(demoVetements.map(v => ({...v})));
      
      if (insertError) {
        console.error('Erreur lors de l\'insertion des données de démo:', insertError);
      } else {
        console.log('Données de démo insérées avec succès!');
      }
      
      return true;
    } else if (error) {
      console.error('Erreur lors de la vérification de la table:', error);
      return false;
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
    
    if (error) {
      console.error('Erreur lors de la récupération des vêtements:', error);
      
      // Renvoyer les données de démo en cas d'erreur
      return demoVetements.map((v, index) => ({
        ...v,
        id: index + 1,
        created_at: new Date().toISOString()
      }));
    }
    
    // Si aucune donnée n'est retournée, la table est peut-être vide
    if (!data || data.length === 0) {
      const { error: insertError } = await supabase
        .from('vetements')
        .insert(demoVetements.map(v => ({...v})));
      
      if (insertError) {
        console.error('Erreur lors de l\'insertion des données de démo:', insertError);
        
        // Renvoyer les données de démo même en cas d'erreur d'insertion
        return demoVetements.map((v, index) => ({
          ...v,
          id: index + 1,
          created_at: new Date().toISOString()
        }));
      }
      
      // Réessayer de récupérer les données après insertion
      const { data: refreshedData } = await supabase
        .from('vetements')
        .select('*')
        .order('created_at', { ascending: false });
      
      return refreshedData as Vetement[] || [];
    }
    
    return data as Vetement[];
  } catch (error) {
    console.error('Erreur lors de la récupération des vêtements:', error);
    
    // Renvoyer les données de démo en cas d'erreur
    return demoVetements.map((v, index) => ({
      ...v,
      id: index + 1,
      created_at: new Date().toISOString()
    }));
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

// Fonction pour mettre à jour un vêtement
export const updateVetement = async (id: number, updates: Partial<Vetement>): Promise<Vetement> => {
  try {
    const { data, error } = await supabase
      .from('vetements')
      .update(updates)
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

// Fonction pour créer la table directement depuis l'application
export const createVetementsTable = async () => {
  try {
    // Utilisation de l'API SQL de Supabase pour créer la table directement
    const { error } = await supabase.from('vetements').select('count').limit(1);
    
    if (error && error.code === '42P01') {
      // La table n'existe pas, essayons de la créer
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS public.vetements (
          id SERIAL PRIMARY KEY,
          nom VARCHAR(255) NOT NULL,
          categorie VARCHAR(50) NOT NULL,
          couleur VARCHAR(50) NOT NULL,
          taille VARCHAR(20) NOT NULL,
          description TEXT,
          marque VARCHAR(100),
          image_url TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
        );
        ALTER TABLE public.vetements ENABLE ROW LEVEL SECURITY;
        CREATE POLICY "Enable all access for authenticated users" ON public.vetements
          USING (auth.role() = 'authenticated')
          WITH CHECK (auth.role() = 'authenticated');
      `;
      
      const { error: sqlError } = await supabase.rpc('exec_sql', {
        query: createTableQuery
      });
      
      if (sqlError) {
        console.error('Erreur SQL lors de la création de la table:', sqlError);
        return false;
      }
      
      return true;
    } else if (error) {
      console.error('Erreur lors de la vérification de la table:', error);
      return false;
    }
    
    // La table existe déjà
    return true;
  } catch (error) {
    console.error('Erreur lors de la création de la table:', error);
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

// Fonctions pour les nouvelles tables

// Fonction pour récupérer toutes les catégories
export const fetchCategories = async (): Promise<Categorie[]> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('nom');
    
    if (error) {
      console.error('Erreur lors de la récupération des catégories:', error);
      throw error;
    }
    
    return data as Categorie[];
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error);
    throw error;
  }
};

// Fonction pour récupérer toutes les marques
export const fetchMarques = async (): Promise<Marque[]> => {
  try {
    const { data, error } = await supabase
      .from('marques')
      .select('*')
      .order('nom');
    
    if (error) {
      console.error('Erreur lors de la récupération des marques:', error);
      throw error;
    }
    
    return data as Marque[];
  } catch (error) {
    console.error('Erreur lors de la récupération des marques:', error);
    throw error;
  }
};

// Fonction pour créer un bucket de stockage si nécessaire
export const createStorageBucket = async () => {
  try {
    // Vérifier si le bucket existe déjà
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('Erreur lors de la récupération des buckets:', bucketsError);
      return false;
    }
    
    // Vérifier si le bucket 'vetements' existe
    const vetementsBucket = buckets.find(b => b.name === 'vetements');
    
    if (!vetementsBucket) {
      // Créer le bucket 'vetements'
      const { error } = await supabase.storage.createBucket('vetements', {
        public: true,
        fileSizeLimit: 5242880, // 5MB
      });
      
      if (error) {
        console.error('Erreur lors de la création du bucket:', error);
        return false;
      }
      
      console.log('Bucket "vetements" créé avec succès');
      return true;
    }
    
    console.log('Le bucket "vetements" existe déjà');
    return true;
  } catch (error) {
    console.error('Erreur lors de la création du bucket:', error);
    return false;
  }
};

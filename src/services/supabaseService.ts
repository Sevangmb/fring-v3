
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
  user_id?: string;
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

// Type pour un ami
export interface Ami {
  id: number;
  user_id: string;
  ami_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  // Données supplémentaires pour l'affichage
  nom?: string;
  email?: string;
  avatar_url?: string;
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
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
            user_id UUID REFERENCES auth.users(id)
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

// Fonction pour récupérer tous les vêtements de l'utilisateur connecté
export const fetchVetements = async (): Promise<Vetement[]> => {
  try {
    // Récupérer la session utilisateur
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;

    // Si pas d'utilisateur connecté, renvoyer un tableau vide ou les données de démo
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
      // Renvoyer un tableau vide en cas d'erreur
      return [];
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
    return [];
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
    // Vérifier que l'utilisateur est propriétaire du vêtement (la RLS s'en chargera)
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
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
          user_id UUID REFERENCES auth.users(id)
        );
        ALTER TABLE public.vetements ENABLE ROW LEVEL SECURITY;
        CREATE POLICY "Users can view their own vetements" 
        ON public.vetements 
        FOR SELECT 
        USING (auth.uid() = user_id);
        
        CREATE POLICY "Users can insert their own vetements" 
        ON public.vetements 
        FOR INSERT 
        WITH CHECK (auth.uid() = user_id);
        
        CREATE POLICY "Users can update their own vetements" 
        ON public.vetements 
        FOR UPDATE 
        USING (auth.uid() = user_id);
        
        CREATE POLICY "Users can delete their own vetements" 
        ON public.vetements 
        FOR DELETE 
        USING (auth.uid() = user_id);
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

// Fonction pour créer un bucket de stockage si nécessaire - Désactivée à cause des problèmes de RLS
export const createStorageBucket = async () => {
  console.log('Création du bucket désactivée pour éviter les erreurs RLS');
  return false;
};

// Fonctions pour gérer les amis
export const fetchAmis = async (): Promise<Ami[]> => {
  try {
    // Récupérer l'ID de l'utilisateur connecté
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;

    if (!userId) {
      return [];
    }

    console.log('Récupération des amis pour l\'utilisateur:', userId);

    // Récupérer les amis (où l'utilisateur est soit l'initiateur, soit le destinataire)
    const { data, error } = await supabase
      .from('amis')
      .select('*')
      .or(`user_id.eq.${userId},ami_id.eq.${userId}`)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Erreur lors de la récupération des amis:', error);
      return [];
    }

    console.log('Amis récupérés:', data);
    
    return data as Ami[];
  } catch (error) {
    console.error('Erreur lors de la récupération des amis:', error);
    return [];
  }
};

// Fonction pour envoyer une demande d'ami
export const envoyerDemandeAmi = async (amiId: string): Promise<Ami> => {
  try {
    // Récupérer l'ID de l'utilisateur connecté
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;

    if (!userId) {
      throw new Error('Vous devez être connecté pour envoyer une demande d\'ami');
    }

    // Vérifier si une demande existe déjà
    const { data: existingRequest, error: checkError } = await supabase
      .from('amis')
      .select('*')
      .or(`and(user_id.eq.${userId},ami_id.eq.${amiId}),and(user_id.eq.${amiId},ami_id.eq.${userId})`)
      .maybeSingle();
    
    if (checkError) {
      console.error('Erreur lors de la vérification de la demande d\'ami:', checkError);
      throw checkError;
    }
    
    if (existingRequest) {
      throw new Error('Une demande d\'ami existe déjà avec cet utilisateur');
    }

    // Insérer la nouvelle demande d'ami
    const { data, error } = await supabase
      .from('amis')
      .insert([
        {
          user_id: userId,
          ami_id: amiId,
          status: 'pending'
        }
      ])
      .select()
      .single();
    
    if (error) {
      console.error('Erreur lors de l\'envoi de la demande d\'ami:', error);
      throw error;
    }
    
    return data as Ami;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la demande d\'ami:', error);
    throw error;
  }
};

// Fonction pour accepter une demande d'ami
export const accepterDemandeAmi = async (amiId: number): Promise<Ami> => {
  try {
    // Récupérer l'ID de l'utilisateur connecté
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;

    if (!userId) {
      throw new Error('Vous devez être connecté pour accepter une demande d\'ami');
    }

    // Mise à jour du statut de la demande
    const { data, error } = await supabase
      .from('amis')
      .update({ status: 'accepted' })
      .eq('id', amiId)
      .eq('ami_id', userId) // S'assure que l'utilisateur est bien le destinataire
      .select()
      .single();
    
    if (error) {
      console.error('Erreur lors de l\'acceptation de la demande d\'ami:', error);
      throw error;
    }
    
    return data as Ami;
  } catch (error) {
    console.error('Erreur lors de l\'acceptation de la demande d\'ami:', error);
    throw error;
  }
};

// Fonction pour rejeter une demande d'ami
export const rejeterDemandeAmi = async (amiId: number): Promise<void> => {
  try {
    // Récupérer l'ID de l'utilisateur connecté
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;

    if (!userId) {
      throw new Error('Vous devez être connecté pour rejeter une demande d\'ami');
    }

    // Supprimer la demande
    const { error } = await supabase
      .from('amis')
      .delete()
      .eq('id', amiId)
      .or(`user_id.eq.${userId},ami_id.eq.${userId}`); // S'assure que l'utilisateur est impliqué
    
    if (error) {
      console.error('Erreur lors du rejet de la demande d\'ami:', error);
      throw error;
    }
  } catch (error) {
    console.error('Erreur lors du rejet de la demande d\'ami:', error);
    throw error;
  }
};

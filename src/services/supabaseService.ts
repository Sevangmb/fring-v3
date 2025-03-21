import { supabase } from '@/lib/supabase';
import { Vetement } from './vetementService';

// Fonction pour ajouter un vêtement en s'assurant qu'il est associé à l'utilisateur connecté
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

// Fonction pour créer une table dans Supabase
export const createTable = async (tableName: string, columns: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('create_table', {
      table_name: tableName,
      columns: columns
    });
    
    if (error) {
      console.error(`Erreur lors de la création de la table ${tableName}:`, error);
      return false;
    }
    
    console.log(`Table ${tableName} créée avec succès`);
    return true;
  } catch (error) {
    console.error(`Erreur lors de la création de la table ${tableName}:`, error);
    return false;
  }
};

// Fonction pour exécuter du SQL personnalisé
export const executeSQL = async (query: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('exec_sql', {
      query: query
    });
    
    if (error) {
      console.error('Erreur lors de l\'exécution du SQL:', error);
      return false;
    }
    
    console.log('SQL exécuté avec succès');
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'exécution du SQL:', error);
    return false;
  }
};

// Fonction pour attribuer tous les vêtements à un utilisateur spécifique
export const assignVetementsToUser = async (email: string): Promise<boolean> => {
  try {
    // D'abord, récupérer l'ID de l'utilisateur par son email
    const { data: userId, error: userError } = await supabase.rpc('get_user_id_by_email', {
      email_param: email
    });
    
    if (userError || !userId) {
      console.error('Erreur lors de la récupération de l\'ID utilisateur:', userError);
      return false;
    }
    
    console.log(`ID utilisateur récupéré pour ${email}:`, userId);
    
    // Ensuite, attribuer tous les vêtements à cet utilisateur
    const { error: assignError } = await supabase.rpc('assign_all_clothes_to_user', {
      target_user_id: userId
    });
    
    if (assignError) {
      console.error('Erreur lors de l\'attribution des vêtements:', assignError);
      return false;
    }
    
    console.log(`Tous les vêtements ont été attribués à l'utilisateur ${email}`);
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'attribution des vêtements:', error);
    return false;
  }
};

// Fonction pour vérifier si un utilisateur existe
export const checkUserExists = async (email: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('get_user_id_by_email', {
      email_param: email
    });
    
    if (error) {
      console.error('Erreur lors de la vérification de l\'utilisateur:', error);
      return false;
    }
    
    return !!data; // Retourne true si l'utilisateur existe
  } catch (error) {
    console.error('Erreur lors de la vérification de l\'utilisateur:', error);
    return false;
  }
};

// Fonction pour initialiser la base de données
export const initializeDatabase = async (): Promise<boolean> => {
  try {
    // Vérifier si les tables nécessaires existent
    const { data: tablesData, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
    
    if (tablesError) {
      console.error('Erreur lors de la vérification des tables:', tablesError);
      return false;
    }
    
    const existingTables = tablesData.map(t => t.table_name);
    console.log('Tables existantes:', existingTables);
    
    // Créer les tables manquantes si nécessaire
    if (!existingTables.includes('vetements')) {
      console.log('Création de la table vetements...');
      const success = await createTable('vetements', `
        id SERIAL PRIMARY KEY,
        nom VARCHAR(255) NOT NULL,
        categorie VARCHAR(50) NOT NULL,
        couleur VARCHAR(50) NOT NULL,
        taille VARCHAR(20) NOT NULL,
        description TEXT,
        marque VARCHAR(100),
        image_url TEXT,
        user_id UUID REFERENCES auth.users(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
      `);
      
      if (!success) {
        console.error('Échec de la création de la table vetements');
        return false;
      }
    }
    
    console.log('Base de données initialisée avec succès');
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de la base de données:', error);
    return false;
  }
};

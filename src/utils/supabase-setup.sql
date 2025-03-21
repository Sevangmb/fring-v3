
-- Voici le SQL à copier/coller dans l'éditeur SQL de Supabase

-- Procédure pour créer la table vetements
CREATE OR REPLACE FUNCTION create_vetements_table()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Vérifier si la table existe déjà
  IF NOT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'vetements'
  ) THEN
    -- Créer la table si elle n'existe pas
    CREATE TABLE public.vetements (
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

    -- Ajouter des commentaires sur la table
    COMMENT ON TABLE public.vetements IS 'Table pour stocker les vêtements des utilisateurs';
    
    -- Ajouter Row Level Security (RLS)
    ALTER TABLE public.vetements ENABLE ROW LEVEL SECURITY;
    
    -- Créer une politique permettant à tous les utilisateurs authentifiés d'accéder à tous les vêtements
    -- Note: En production, vous voudriez limiter l'accès aux vêtements de l'utilisateur connecté
    CREATE POLICY "Enable all access for authenticated users" ON public.vetements
      USING (auth.role() = 'authenticated')
      WITH CHECK (auth.role() = 'authenticated');
  END IF;
END;
$$;

-- Procédure pour créer la procédure stockée (inception!)
CREATE OR REPLACE FUNCTION create_stored_procedure()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Cette fonction existe déjà puisqu'elle est en train d'être exécutée :)
  NULL;
END;
$$;


-- Voici le SQL à copier/coller dans l'éditeur SQL de Supabase pour créer les tables et fonctions nécessaires

-- Créer la fonction pour exécuter du SQL (nécessaire pour notre approche dynamique)
CREATE OR REPLACE FUNCTION public.exec_sql(query text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE query;
END;
$$;

-- Créer la fonction pour créer des tables dynamiquement
CREATE OR REPLACE FUNCTION public.create_table(table_name text, columns text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  create_query text;
BEGIN
  create_query := 'CREATE TABLE IF NOT EXISTS public.' || table_name || ' (' || columns || ')';
  EXECUTE create_query;
  
  -- Ajouter la sécurité RLS par défaut
  EXECUTE 'ALTER TABLE public.' || table_name || ' ENABLE ROW LEVEL SECURITY';
  
  -- Créer une politique par défaut
  EXECUTE 'CREATE POLICY "Enable all access for authenticated users" ON public.' || table_name || ' 
    USING (auth.role() = ''authenticated'')
    WITH CHECK (auth.role() = ''authenticated'')';
END;
$$;

-- Créer directement la table vetements
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

-- Ajouter la sécurité RLS
ALTER TABLE public.vetements ENABLE ROW LEVEL SECURITY;

-- Créer une politique pour les utilisateurs authentifiés
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.vetements;
CREATE POLICY "Enable all access for authenticated users" ON public.vetements
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Insérer quelques données de démo (optionnel)
INSERT INTO public.vetements (nom, categorie, couleur, taille, description, marque)
VALUES
  ('T-shirt blanc', 't-shirt', 'blanc', 'M', 'T-shirt basique en coton bio', 'Nike'),
  ('Jean bleu', 'jeans', 'bleu', '40', 'Jean slim en denim stretch', 'Levi''s'),
  ('Veste noire', 'veste', 'noir', 'L', 'Veste légère pour la mi-saison', 'Zara'),
  ('Pull gris', 'pull', 'gris', 'S', 'Pull chaud en laine mélangée', 'H&M'),
  ('Chemise à carreaux', 'chemise', 'multicolore', 'M', 'Chemise en flanelle pour l''automne', 'Gap'),
  ('Short beige', 'short', 'beige', 'M', 'Short en coton léger pour l''été', 'Uniqlo')
ON CONFLICT DO NOTHING;

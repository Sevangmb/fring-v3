
-- Mettre à jour les politiques de sécurité sur la table vetements
-- D'abord, activer RLS si ce n'est pas déjà fait
ALTER TABLE public.vetements ENABLE ROW LEVEL SECURITY;

-- Supprimer toutes les politiques existantes pour la table vetements
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.vetements;

-- Créer une politique permettant aux utilisateurs de voir uniquement leurs propres vêtements
CREATE POLICY "Users can view their own vetements" 
ON public.vetements 
FOR SELECT 
USING (auth.uid() = user_id);

-- Créer une politique permettant aux utilisateurs d'insérer uniquement leurs propres vêtements
CREATE POLICY "Users can insert their own vetements" 
ON public.vetements 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Créer une politique permettant aux utilisateurs de mettre à jour uniquement leurs propres vêtements
CREATE POLICY "Users can update their own vetements" 
ON public.vetements 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Créer une politique permettant aux utilisateurs de supprimer uniquement leurs propres vêtements
CREATE POLICY "Users can delete their own vetements" 
ON public.vetements 
FOR DELETE 
USING (auth.uid() = user_id);

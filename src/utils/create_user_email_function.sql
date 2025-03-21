
-- Fonction pour récupérer l'email d'un utilisateur par son ID
CREATE OR REPLACE FUNCTION public.get_user_email_by_id(user_id_param UUID)
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT email FROM auth.users WHERE id = user_id_param;
$$;

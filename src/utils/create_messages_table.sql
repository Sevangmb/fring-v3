
-- Vérifier si la table messages existe, sinon la créer
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES auth.users(id),
  receiver_id UUID NOT NULL REFERENCES auth.users(id),
  content TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Ajouter les politiques RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre la lecture des messages envoyés ou reçus
CREATE POLICY "Users can read their own messages"
ON public.messages
FOR SELECT
USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Politique pour permettre l'insertion de messages
CREATE POLICY "Users can insert messages"
ON public.messages
FOR INSERT
WITH CHECK (auth.uid() = sender_id);

-- Politique pour permettre la mise à jour des messages
CREATE POLICY "Users can update their messages"
ON public.messages
FOR UPDATE
USING (auth.uid() = sender_id OR (auth.uid() = receiver_id AND read = false));

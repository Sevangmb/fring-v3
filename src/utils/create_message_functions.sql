
-- Fonction pour obtenir le dernier message de chaque conversation
CREATE OR REPLACE FUNCTION public.get_conversation_previews()
RETURNS TABLE (
    id UUID, 
    sender_id UUID, 
    receiver_id UUID, 
    content TEXT, 
    read BOOLEAN, 
    created_at TIMESTAMP WITH TIME ZONE
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    current_user_id UUID;
BEGIN
    -- Récupérer l'ID de l'utilisateur connecté
    current_user_id := auth.uid();
    
    -- Vérifier que l'utilisateur est authentifié
    IF current_user_id IS NULL THEN
        RAISE EXCEPTION 'Utilisateur non authentifié';
    END IF;
    
    RETURN QUERY
    WITH ranked_messages AS (
        SELECT 
            m.*,
            ROW_NUMBER() OVER (
                PARTITION BY 
                    CASE 
                        WHEN m.sender_id = current_user_id THEN m.receiver_id 
                        ELSE m.sender_id 
                    END
                ORDER BY m.created_at DESC
            ) as rn
        FROM 
            public.messages m
        WHERE 
            m.sender_id = current_user_id OR m.receiver_id = current_user_id
    )
    SELECT 
        rm.id, 
        rm.sender_id, 
        rm.receiver_id, 
        rm.content, 
        rm.read, 
        rm.created_at
    FROM 
        ranked_messages rm
    WHERE 
        rm.rn = 1
    ORDER BY 
        rm.created_at DESC;
END;
$$;

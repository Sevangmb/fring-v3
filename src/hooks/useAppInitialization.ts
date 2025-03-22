
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { assignVetementsToUser } from "@/services/database";
import { createDemoVetementsForUser } from "@/services/vetement/demoVetements";

export function useAppInitialization() {
  const [initialized, setInitialized] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const { user, loading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user && !loading && !initialized) {
      const checkNewUser = async () => {
        try {
          const { data, error } = await supabase
            .from('vetements')
            .select('count')
            .eq('user_id', user.id)
            .single();
          
          if (!error && data && data.count === 0) {
            setIsNewUser(true);
            const result = await createDemoVetementsForUser();
            if (result) {
              toast({
                title: "Bienvenue !",
                description: "Nous avons ajouté quelques vêtements de démo à votre collection.",
              });
            }
          }
          
          setInitialized(true);
          sessionStorage.setItem('userInitialized', 'true');
        } catch (error) {
          console.error("Erreur lors de la vérification de l'utilisateur:", error);
          setInitialized(true);
        }
      };
      
      const alreadyInitialized = sessionStorage.getItem('userInitialized');
      if (!alreadyInitialized) {
        checkNewUser();
      } else {
        setInitialized(true);
      }
    }
  }, [user, loading, toast, initialized]);

  useEffect(() => {
    const alreadyInitialized = sessionStorage.getItem('dbInitialized');
    
    if (!alreadyInitialized && !initialized) {
      const setupDatabase = async () => {
        try {
          const targetUserEmail = 'sevans@hotmail.fr';
          const assignResult = await assignVetementsToUser(targetUserEmail);
          
          if (assignResult) {
            console.log(`Tous les vêtements ont été attribués à ${targetUserEmail}`);
            toast({
              title: "Initialisation réussie",
              description: `Tous les vêtements ont été attribués à ${targetUserEmail}`,
            });
          } else {
            console.warn(`Impossible d'attribuer les vêtements à ${targetUserEmail}`);
            toast({
              title: "Attention",
              description: `Impossible d'attribuer les vêtements à ${targetUserEmail}`,
              variant: "destructive",
            });
          }
          
          sessionStorage.setItem('dbInitialized', 'true');
          setInitialized(true);
        } catch (error) {
          console.error("Erreur d'initialisation:", error);
          toast({
            title: "Erreur",
            description: "Une erreur est survenue lors de l'initialisation",
            variant: "destructive",
          });
          sessionStorage.setItem('dbInitialized', 'true');
          setInitialized(true);
        }
      };
      
      setupDatabase();
    } else {
      setInitialized(true);
    }
  }, [initialized, toast]);

  return { initialized, isNewUser };
}

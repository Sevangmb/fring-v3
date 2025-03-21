
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/templates/Layout";
import { Heading, Text } from "@/components/atoms/Typography";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { AuthLoading, NotAuthenticated } from "@/components/vetements/AuthStateDisplay";
import VetementFormContainer from "@/components/vetements/VetementFormContainer";

// Type pour les marques
interface Marque {
  id: number;
  nom: string;
  site_web: string | null;
  logo_url: string | null;
}

const AjouterVetementPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const [marques, setMarques] = useState<Marque[]>([]);

  useEffect(() => {
    // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
    if (!authLoading && !user) {
      toast({
        title: "Non autorisé",
        description: "Vous devez être connecté pour ajouter un vêtement.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    // Charger les marques depuis Supabase
    const fetchMarques = async () => {
      try {
        const { data, error } = await supabase
          .from('marques')
          .select('*')
          .order('nom');
        
        if (error) {
          console.error("Erreur lors du chargement des marques:", error);
        } else {
          setMarques(data || []);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des marques:", error);
      }
    };

    if (user) {
      fetchMarques();
    }
  }, [user, authLoading, toast, navigate]);

  // Affichage conditionnel en fonction de l'authentification
  if (authLoading) {
    return <AuthLoading loading={authLoading} />;
  }

  if (!user) {
    return <NotAuthenticated />;
  }

  return (
    <Layout>
      <div className="pt-24 pb-6 bg-accent/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate("/mes-vetements")}
              className="rounded-full"
            >
              <ArrowLeft size={20} />
            </Button>
            <Heading>Ajouter un vêtement</Heading>
          </div>
          <Text className="text-muted-foreground max-w-2xl mt-4">
            Remplissez le formulaire ci-dessous pour ajouter un nouveau vêtement à votre collection.
          </Text>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <VetementFormContainer
          user={user}
          marques={marques}
        />
      </div>
    </Layout>
  );
};

export default AjouterVetementPage;

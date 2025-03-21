
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/templates/Layout";
import MesVetementsSection from "@/components/organisms/MesVetements";
import { Heading, Text } from "@/components/atoms/Typography";
import { Button } from "@/components/ui/button";
import { Plus, List, LogIn } from "lucide-react";
import { createVetementsTable } from "@/services/supabaseService";
import { useAuth } from "@/contexts/AuthContext";

const MesVetementsPage = () => {
  const [initialized, setInitialized] = useState(false);
  const { user, loading } = useAuth();

  // Initialiser la base de données au chargement de la page, une seule fois
  useEffect(() => {
    // Utiliser sessionStorage pour éviter d'initialiser à chaque visite de page
    const alreadyInitialized = sessionStorage.getItem('dbInitialized');
    
    if (!alreadyInitialized && !initialized) {
      const setupDatabase = async () => {
        try {
          // Essayer de créer la table directement via SQL, silencieusement
          await createVetementsTable();
          // Marquer comme initialisé
          sessionStorage.setItem('dbInitialized', 'true');
          setInitialized(true);
        } catch (error) {
          console.error("Erreur d'initialisation:", error);
          // Même en cas d'erreur, on marque comme initialisé pour ne pas réessayer
          sessionStorage.setItem('dbInitialized', 'true');
          setInitialized(true);
        }
      };
      
      setupDatabase();
    } else {
      // Déjà initialisé selon sessionStorage
      setInitialized(true);
    }
  }, [initialized]);

  // Affichage conditionnel en fonction de l'état d'authentification
  return (
    <Layout>
      <div className="pt-24 pb-6 bg-accent/10">
        <div className="container mx-auto px-4">
          <Heading className="text-center">Mes Vêtements</Heading>
          <Text className="text-center text-muted-foreground max-w-2xl mx-auto mt-4">
            {user 
              ? "Découvrez votre collection personnelle de vêtements."
              : "Connectez-vous pour voir et gérer votre collection de vêtements."}
          </Text>
          
          <div className="flex justify-center gap-4 mt-8">
            {user ? (
              <>
                <Button asChild>
                  <Link to="/mes-vetements/ajouter">
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter un vêtement
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/mes-vetements/liste">
                    <List className="mr-2 h-4 w-4" />
                    Voir tous les vêtements
                  </Link>
                </Button>
              </>
            ) : (
              <Button asChild>
                <Link to="/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  Se connecter
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
      {!loading && <MesVetementsSection isAuthenticated={!!user} />}
    </Layout>
  );
};

export default MesVetementsPage;


import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/templates/Layout";
import MesVetementsSection from "@/components/organisms/MesVetements";
import { Heading, Text } from "@/components/atoms/Typography";
import { Button } from "@/components/ui/button";
import { Plus, List, Database } from "lucide-react";
import { initializeDatabase, createVetementsTable, createStorageBucket } from "@/services/supabaseService";
import { useToast } from "@/hooks/use-toast";

const MesVetementsPage = () => {
  const { toast } = useToast();

  // Initialiser la base de données au chargement de la page
  useEffect(() => {
    const setupDatabase = async () => {
      try {
        // Essayer d'abord de créer la table directement via SQL
        const tableCreated = await createVetementsTable();
        
        // Créer le bucket de stockage pour les images
        const bucketCreated = await createStorageBucket();
        
        if (!tableCreated) {
          // Fallback: essayer d'initialiser avec l'ancienne méthode
          const success = await initializeDatabase();
          
          if (success) {
            toast({
              title: "Base de données initialisée",
              description: "La connexion à la base de données a été établie avec succès.",
            });
          } else {
            toast({
              title: "Base de données non disponible",
              description: "Utilisation des données de démonstration.",
              variant: "destructive",
            });
          }
        } else {
          if (bucketCreated) {
            toast({
              title: "Initialisation réussie",
              description: "La base de données et le stockage ont été initialisés avec succès.",
            });
          } else {
            toast({
              title: "Base de données initialisée",
              description: "La table a été créée ou existait déjà, mais le bucket de stockage n'a pas pu être créé.",
            });
          }
        }
      } catch (error) {
        console.error("Erreur d'initialisation:", error);
        toast({
          title: "Erreur",
          description: "Impossible d'initialiser la base de données. Utilisation des données de démonstration.",
          variant: "destructive",
        });
      }
    };
    
    setupDatabase();
  }, [toast]);

  return (
    <Layout>
      <div className="pt-24 pb-6 bg-accent/10">
        <div className="container mx-auto px-4">
          <Heading className="text-center">Mes Vêtements</Heading>
          <Text className="text-center text-muted-foreground max-w-2xl mx-auto mt-4">
            Découvrez notre collection de vêtements de qualité, conçus pour vous.
          </Text>
          
          <div className="flex justify-center gap-4 mt-8">
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
          </div>
        </div>
      </div>
      <MesVetementsSection />
    </Layout>
  );
};

export default MesVetementsPage;

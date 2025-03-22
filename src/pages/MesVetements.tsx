
import React, { useEffect, useState } from "react";
import Layout from "@/components/templates/Layout";
import MesVetementsSection from "@/components/organisms/MesVetements";
import { Heading, Text } from "@/components/atoms/Typography";
import { assignVetementsToUser } from "@/services/database";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { createDemoVetementsForUser } from "@/services/vetement/demoVetements";
import { supabase } from "@/lib/supabase";
import VetementsContainer from "@/components/vetements/VetementsContainer";
import VetementsPageHeader from "@/components/molecules/VetementsPageHeader";
import { Tabs } from "@/components/ui/tabs";
import { TabsContent } from "@/components/ui/tabs";
import VetementsTabsList from "@/components/vetements/tabs/VetementsTabsList";
import MesVetementsTab from "@/components/vetements/tabs/MesVetementsTab";
import VetementsAmisTab from "@/components/vetements/tabs/VetementsAmisTab";
import MesEnsemblesTab from "@/components/vetements/tabs/MesEnsemblesTab";
import MesFavorisTab from "@/components/vetements/tabs/MesFavorisTab";

const MesVetements: React.FC = () => {
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

  return (
    <Layout>
      <VetementsContainer>
        <section className="w-full">
          <VetementsPageHeader
            className="text-center"
            title="Mes Vêtements"
            description="Découvrez votre collection personnelle de vêtements."
            isAuthenticated={!!user}
          />
          
          <Tabs defaultValue="mes-vetements" className="w-full">
            <VetementsTabsList />
            
            <TabsContent value="mes-vetements">
              <MesVetementsTab
                vetements={[]}
                categories={[]}
                marques={[]}
                acceptedFriends={[]}
                activeTab=""
                isLoading={false}
                error={null}
                isAuthenticated={!!user}
                onVetementDeleted={() => {}}
                onTabChange={() => {}}
              />
            </TabsContent>
            
            <TabsContent value="vetements-amis">
              <VetementsAmisTab
                vetements={[]}
                categories={[]}
                marques={[]}
                acceptedFriends={[]}
                activeTab=""
                isLoading={false}
                error={null}
                isAuthenticated={!!user}
                onVetementDeleted={() => {}}
                onTabChange={() => {}}
              />
            </TabsContent>
            
            <TabsContent value="mes-ensembles">
              <MesEnsemblesTab />
            </TabsContent>
            
            <TabsContent value="mes-favoris">
              <MesFavorisTab />
            </TabsContent>
          </Tabs>
        </section>
      </VetementsContainer>
    </Layout>
  );
};

export default MesVetements;

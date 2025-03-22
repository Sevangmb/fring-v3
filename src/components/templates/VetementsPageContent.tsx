import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import VetementsTabsList from "@/components/vetements/tabs/VetementsTabsList";
import MesVetementsTab from "@/components/vetements/tabs/MesVetementsTab";
import VetementsAmisTab from "@/components/vetements/tabs/VetementsAmisTab";
import MesEnsemblesTab from "@/components/vetements/tabs/MesEnsemblesTab";
import { useVetementsData } from "@/hooks/useVetementsData";
import { useAmis } from "@/hooks/useAmis";
import VetementsPageHeader from "@/components/molecules/VetementsPageHeader";
import AjouterVetement from "@/pages/vetements/AjouterVetement";
import AjouterEnsemble from "@/pages/ensembles/AjouterEnsemble";
import { Text } from "@/components/atoms/Typography";
import { TabType } from "@/components/vetements/types/TabTypes";

interface VetementsPageContentProps {
  initialTab?: string;
}

const VetementsPageContent: React.FC<VetementsPageContentProps> = ({ 
  initialTab = "mes-vetements" 
}) => {
  const { user } = useAuth();
  const { filteredAmis, loadingAmis } = useAmis();
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [categoryTab, setCategoryTab] = useState<string>("");
  
  const {
    vetements,
    categories,
    marques,
    isLoading,
    error,
    reloadVetements
  } = useVetementsData(
    activeTab as 'mes-vetements' | 'vetements-amis' | 'mes-ensembles',
    ""
  );

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleVetementDeleted = (id: number) => {
    console.log(`Vêtement ${id} supprimé`);
    reloadVetements();
  };

  const acceptedFriends = filteredAmis?.amisAcceptes || [];

  return (
    <section className="w-full">
      <VetementsPageHeader
        className="text-center"
        title="Mes Vêtements"
        description="Découvrez votre collection personnelle de vêtements."
        isAuthenticated={!!user}
      />
      
      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={handleTabChange} className="w-full">
        <VetementsTabsList onTabChange={handleTabChange} activeTab={activeTab as TabType} />
        
        <TabsContent value="mes-vetements">
          <MesVetementsTab
            vetements={vetements}
            categories={categories}
            marques={marques.map(m => typeof m === 'string' ? m : m.nom)}
            acceptedFriends={acceptedFriends}
            activeTab={categoryTab}
            isLoading={isLoading || loadingAmis}
            error={error}
            isAuthenticated={!!user}
            onVetementDeleted={handleVetementDeleted}
            onTabChange={setCategoryTab}
          />
        </TabsContent>
        
        <TabsContent value="ajouter-vetement">
          <AjouterVetement />
        </TabsContent>
        
        <TabsContent value="vetements-amis">
          <VetementsAmisTab
            vetements={vetements}
            categories={categories}
            marques={marques.map(m => typeof m === 'string' ? m : m.nom)}
            acceptedFriends={acceptedFriends}
            activeTab={categoryTab}
            isLoading={isLoading || loadingAmis}
            error={error}
            isAuthenticated={!!user}
            onVetementDeleted={handleVetementDeleted}
            onTabChange={setCategoryTab}
          />
        </TabsContent>
        
        <TabsContent value="mes-ensembles">
          <MesEnsemblesTab
            categories={categories}
            marques={marques.map(m => typeof m === 'string' ? m : m.nom)}
            acceptedFriends={acceptedFriends}
            isLoading={isLoading || loadingAmis}
          />
        </TabsContent>

        <TabsContent value="ajouter-ensemble">
          <AjouterEnsemble />
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default VetementsPageContent;

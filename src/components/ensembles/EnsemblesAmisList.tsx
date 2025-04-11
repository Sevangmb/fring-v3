
import React, { useState, useEffect } from 'react';
import { useAmis } from '@/hooks/useAmis';
import { useEnsemblesAmis } from '@/hooks/ensembles/useEnsemblesAmis';
import EnsembleCard from './EnsembleCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Shirt, ChevronDown, AlertTriangle, RefreshCw } from 'lucide-react';
import { Text } from '@/components/atoms/Typography';
import { useIsMobile } from '@/hooks/use-mobile';
import { Drawer, DrawerContent, DrawerTrigger, DrawerClose } from '@/components/ui/drawer';
import FloatingAddButton from '@/components/molecules/FloatingAddButton';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';

const EnsemblesAmisList: React.FC = () => {
  const { user } = useAuth();
  const { filteredAmis, loadingAmis } = useAmis();
  const [selectedFriend, setSelectedFriend] = useState<string>("all");
  const { ensemblesAmis, loading, error, refreshEnsemblesAmis } = useEnsemblesAmis(selectedFriend !== "all" ? selectedFriend : undefined);
  const isMobile = useIsMobile();
  
  // État pour savoir si le drawer des amis est ouvert (mobile uniquement)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // État pour stocker le nom de l'ami sélectionné
  const [selectedFriendName, setSelectedFriendName] = useState<string>("Tous les amis");
  
  useEffect(() => {
    if (error) {
      console.error("Erreur de chargement des ensembles:", error);
    }
    
    // Log des ensembles pour débogage
    if (ensemblesAmis && ensemblesAmis.length > 0) {
      console.log("Ensembles chargés:", ensemblesAmis.length);
    }
  }, [error, ensemblesAmis]);
  
  const handleFriendChange = (friendId: string) => {
    setSelectedFriend(friendId);
    
    // Ne pas permettre de sélectionner son propre ID comme ami
    if (friendId === user?.id) {
      friendId = "all";
    }
    
    // Mettre à jour le nom de l'ami sélectionné
    if (friendId === "all") {
      setSelectedFriendName("Tous les amis");
    } else {
      const ami = filteredAmis?.amisAcceptes?.find(ami => {
        const amiId = ami.ami_id === ami.user_id ? ami.ami_id : ami.user_id;
        return amiId === friendId;
      });
      setSelectedFriendName(ami?.email?.split('@')[0] || "Ami");
    }
    
    // Fermer le drawer après la sélection sur mobile
    if (isMobile) {
      setIsDrawerOpen(false);
    }
  };
  
  const handleRetry = () => {
    refreshEnsemblesAmis();
  };

  if (loadingAmis) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array(4).fill(0).map((_, index) => (
            <Skeleton key={index} className="h-64 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!filteredAmis?.amisAcceptes || filteredAmis.amisAcceptes.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 flex flex-col items-center justify-center py-10">
          <Shirt size={48} className="text-muted-foreground mb-2" />
          <Text className="text-center">Vous n'avez pas encore d'amis pour voir leurs ensembles.</Text>
        </CardContent>
      </Card>
    );
  }

  // Version mobile avec un Drawer pour sélectionner les amis
  if (isMobile) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium">{selectedFriendName}</h2>
          
          <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <DrawerTrigger asChild>
              <button className="flex items-center gap-2 px-3 py-2 rounded-md border text-sm">
                Sélectionner un ami
                <ChevronDown size={16} />
              </button>
            </DrawerTrigger>
            <DrawerContent className="p-4">
              <div className="space-y-2 max-h-[70vh] overflow-y-auto">
                <h3 className="font-medium mb-2">Choisir un ami</h3>
                <button 
                  onClick={() => handleFriendChange("all")}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm ${selectedFriend === "all" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                >
                  Tous les amis
                </button>
                
                {filteredAmis.amisAcceptes.map((ami) => (
                  <button 
                    key={ami.id} 
                    onClick={() => handleFriendChange(ami.ami_id === ami.user_id ? ami.ami_id : ami.user_id)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm ${selectedFriend === (ami.ami_id === ami.user_id ? ami.ami_id : ami.user_id) ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                  >
                    {ami.email?.split('@')[0] || 'Ami'}
                  </button>
                ))}
              </div>
              <DrawerClose className="sr-only">Fermer</DrawerClose>
            </DrawerContent>
          </Drawer>
        </div>

        {renderEnsemblesList()}
        <FloatingAddButton visible={false} />
      </div>
    );
  }

  // Version desktop avec les onglets
  return (
    <div className="space-y-4">
      <Tabs defaultValue="all" onValueChange={handleFriendChange} className="w-full">
        <TabsList className="mb-4 flex flex-wrap h-auto">
          <TabsTrigger value="all" className="mb-1">
            Tous les amis
          </TabsTrigger>
          {filteredAmis.amisAcceptes.map((ami) => (
            <TabsTrigger 
              key={ami.id} 
              value={ami.ami_id === ami.user_id ? ami.ami_id : ami.user_id} 
              className="mb-1"
              disabled={ami.ami_id === user?.id || ami.user_id === user?.id} // Désactiver l'onglet si c'est l'utilisateur actuel
            >
              {ami.email?.split('@')[0] || 'Ami'}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="mt-4">
          {renderEnsemblesList()}
        </TabsContent>
        
        {filteredAmis.amisAcceptes.map((ami) => (
          <TabsContent 
            key={ami.id} 
            value={ami.ami_id === ami.user_id ? ami.ami_id : ami.user_id}
            className="mt-4"
          >
            {renderEnsemblesList()}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );

  function renderEnsemblesList() {
    if (loading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array(4).fill(0).map((_, index) => (
            <Skeleton key={index} className="h-64 w-full" />
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <Card>
          <CardContent className="pt-6 flex flex-col items-center justify-center py-10">
            <Alert variant="destructive" className="mb-4 w-full">
              <AlertTriangle className="h-4 w-4 mr-2" />
              <AlertDescription>
                Impossible de charger les ensembles. Veuillez réessayer plus tard.
              </AlertDescription>
            </Alert>
            <Button 
              onClick={handleRetry} 
              variant="outline"
              className="flex items-center gap-2 mt-4"
            >
              <RefreshCw size={16} />
              Réessayer
            </Button>
          </CardContent>
        </Card>
      );
    }

    if (!ensemblesAmis || ensemblesAmis.length === 0) {
      return (
        <Card>
          <CardContent className="pt-6 flex flex-col items-center justify-center py-10">
            <Shirt size={48} className="text-muted-foreground mb-2" />
            <Text className="text-center">
              {selectedFriend === "all"
                ? "Vos amis n'ont pas encore créé d'ensembles."
                : "Cet ami n'a pas encore créé d'ensembles."}
            </Text>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {ensemblesAmis.map((ensemble) => (
          <EnsembleCard key={ensemble.id} ensemble={ensemble} />
        ))}
      </div>
    );
  }
};

export default EnsemblesAmisList;

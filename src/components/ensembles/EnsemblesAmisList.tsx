
import React, { useState } from 'react';
import { useAmis } from '@/hooks/useAmis';
import { useEnsemblesAmis } from '@/hooks/ensembles/useEnsemblesAmis';
import EnsembleCard from './EnsembleCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Shirt } from 'lucide-react';
import { Text } from '@/components/atoms/Typography';

const EnsemblesAmisList: React.FC = () => {
  const { filteredAmis, loadingAmis } = useAmis();
  const [selectedFriend, setSelectedFriend] = useState<string>("all");
  const { ensemblesAmis, loading, error, refreshEnsemblesAmis } = useEnsemblesAmis(selectedFriend !== "all" ? selectedFriend : undefined);
  
  const handleFriendChange = (friendId: string) => {
    setSelectedFriend(friendId);
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

  if (!filteredAmis?.amisAcceptes.length) {
    return (
      <Card>
        <CardContent className="pt-6 flex flex-col items-center justify-center py-10">
          <Shirt size={48} className="text-muted-foreground mb-2" />
          <Text className="text-center">Vous n'avez pas encore d'amis pour voir leurs ensembles.</Text>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="all" onValueChange={handleFriendChange} className="w-full">
        <TabsList className="mb-4 flex flex-wrap h-auto">
          <TabsTrigger value="all" className="mb-1">
            Tous les amis
          </TabsTrigger>
          {filteredAmis.amisAcceptes.map((ami) => (
            <TabsTrigger key={ami.id} value={ami.ami_id === ami.user_id ? ami.ami_id : ami.user_id} className="mb-1">
              {ami.email || 'Ami'}
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
          <CardContent className="pt-6">
            <Text className="text-center text-red-500">
              Une erreur est survenue lors du chargement des ensembles.
            </Text>
          </CardContent>
        </Card>
      );
    }

    if (!ensemblesAmis.length) {
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

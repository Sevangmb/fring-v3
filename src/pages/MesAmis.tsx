
import React, { useEffect, useState } from "react";
import Layout from "@/components/templates/Layout";
import { Heading, Text } from "@/components/atoms/Typography";
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus, Check, X, User, Clock, UserCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { fetchAmis, accepterDemandeAmi, rejeterDemandeAmi, Ami } from "@/services/amiService";
import { useToast } from "@/hooks/use-toast";
import Card, { CardHeader, CardTitle, CardFooter } from "@/components/molecules/Card";

const MesAmisPage = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [amis, setAmis] = useState<Ami[]>([]);
  const [loadingAmis, setLoadingAmis] = useState(true);

  useEffect(() => {
    const chargerAmis = async () => {
      if (!user) {
        setLoadingAmis(false);
        return;
      }

      try {
        setLoadingAmis(true);
        const listeAmis = await fetchAmis();
        setAmis(listeAmis);
      } catch (error) {
        console.error("Erreur lors du chargement des amis:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger vos amis.",
          variant: "destructive",
        });
      } finally {
        setLoadingAmis(false);
      }
    };

    chargerAmis();
  }, [user, toast]);

  const handleAccepterDemande = async (amiId: number) => {
    try {
      await accepterDemandeAmi(amiId);
      toast({
        title: "Demande acceptée",
        description: "Vous êtes maintenant amis !",
      });
      
      // Mettre à jour la liste des amis
      const listeAmis = await fetchAmis();
      setAmis(listeAmis);
    } catch (error) {
      console.error("Erreur lors de l'acceptation de la demande:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'accepter cette demande.",
        variant: "destructive",
      });
    }
  };

  const handleRejeterDemande = async (amiId: number) => {
    try {
      await rejeterDemandeAmi(amiId);
      toast({
        title: "Demande rejetée",
        description: "La demande d'ami a été rejetée.",
      });
      
      // Mettre à jour la liste des amis
      const listeAmis = await fetchAmis();
      setAmis(listeAmis);
    } catch (error) {
      console.error("Erreur lors du rejet de la demande:", error);
      toast({
        title: "Erreur",
        description: "Impossible de rejeter cette demande.",
        variant: "destructive",
      });
    }
  };

  // Filtrer les amis par statut
  const demandesRecues = amis.filter(ami => 
    ami.status === 'pending' && ami.ami_id === user?.id
  );
  
  const demandesEnvoyees = amis.filter(ami => 
    ami.status === 'pending' && ami.user_id === user?.id
  );
  
  const amisAcceptes = amis.filter(ami => 
    ami.status === 'accepted'
  );

  return (
    <Layout>
      <div className="pt-24 pb-6 bg-accent/10">
        <div className="container mx-auto px-4">
          <Heading className="text-center">Mes Amis</Heading>
          <Text className="text-center text-muted-foreground max-w-2xl mx-auto mt-4">
            {user 
              ? "Retrouvez et gérez tous vos amis dans cette section."
              : "Connectez-vous pour voir et gérer vos amis."}
          </Text>
          
          {!user && !loading && (
            <div className="flex justify-center mt-8">
              <Button asChild>
                <Link to="/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  Se connecter
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {user && (
        <div className="container mx-auto px-4 py-12">
          {loadingAmis ? (
            <div className="flex justify-center">
              <div className="animate-pulse space-y-4">
                <div className="h-20 w-64 bg-muted rounded-lg"></div>
                <div className="h-20 w-64 bg-muted rounded-lg"></div>
              </div>
            </div>
          ) : (
            <div className="space-y-10">
              {/* Demandes d'amis reçues */}
              <div>
                <Heading as="h2" variant="h3" className="mb-4">Demandes d'amis reçues</Heading>
                {demandesRecues.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {demandesRecues.map((demande) => (
                      <Card key={demande.id} hoverable>
                        <CardHeader>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <User size={20} />
                            </div>
                            <CardTitle>Demande d'ami</CardTitle>
                          </div>
                          <Text className="mt-2">
                            Vous avez reçu une demande d'ami.
                          </Text>
                        </CardHeader>
                        <CardFooter className="flex justify-end gap-2">
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleRejeterDemande(demande.id)}
                          >
                            <X className="mr-1 h-4 w-4" />
                            Refuser
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => handleAccepterDemande(demande.id)}
                          >
                            <Check className="mr-1 h-4 w-4" />
                            Accepter
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="bg-card rounded-lg shadow-sm p-6 border">
                    <Text className="font-medium mb-2">Aucune demande reçue</Text>
                    <Text variant="small" className="text-muted-foreground">
                      Vous n'avez pas de demande d'ami en attente.
                    </Text>
                  </div>
                )}
              </div>
              
              {/* Demandes d'amis envoyées */}
              <div>
                <Heading as="h2" variant="h3" className="mb-4">Demandes d'amis envoyées</Heading>
                {demandesEnvoyees.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {demandesEnvoyees.map((demande) => (
                      <Card key={demande.id} hoverable>
                        <CardHeader>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                              <Clock size={20} />
                            </div>
                            <CardTitle>Demande en attente</CardTitle>
                          </div>
                          <Text className="mt-2">
                            Votre demande d'ami est en attente d'acceptation.
                          </Text>
                        </CardHeader>
                        <CardFooter className="flex justify-end">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleRejeterDemande(demande.id)}
                          >
                            <X className="mr-1 h-4 w-4" />
                            Annuler
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="bg-card rounded-lg shadow-sm p-6 border">
                    <Text className="font-medium mb-2">Aucune demande envoyée</Text>
                    <Text variant="small" className="text-muted-foreground">
                      Vous n'avez pas envoyé de demande d'ami.
                    </Text>
                  </div>
                )}
              </div>
              
              {/* Amis confirmés */}
              <div>
                <Heading as="h2" variant="h3" className="mb-4">Mes amis</Heading>
                {amisAcceptes.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {amisAcceptes.map((ami) => (
                      <Card key={ami.id} hoverable>
                        <CardHeader>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                              <UserCheck size={20} />
                            </div>
                            <CardTitle>Ami</CardTitle>
                          </div>
                          <Text className="mt-2">
                            Vous êtes amis depuis le {new Date(ami.created_at).toLocaleDateString()}.
                          </Text>
                        </CardHeader>
                        <CardFooter className="flex justify-end">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleRejeterDemande(ami.id)}
                          >
                            <X className="mr-1 h-4 w-4" />
                            Retirer
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="bg-card rounded-lg shadow-sm p-6 border">
                    <Text className="font-medium mb-2">Aucun ami pour le moment</Text>
                    <Text variant="small" className="text-muted-foreground">
                      Commencez à ajouter des amis pour les voir apparaître ici.
                    </Text>
                  </div>
                )}
              </div>

              {/* Bouton pour ajouter des amis */}
              <div className="flex justify-center mt-8">
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Ajouter des amis
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
};

export default MesAmisPage;

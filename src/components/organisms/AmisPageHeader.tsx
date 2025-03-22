
import React from "react";
import { Heading, Text } from "@/components/atoms/Typography";
import { Button } from "@/components/ui/button";
import { LogIn, Mail, Users, Clock, Shirt, List } from "lucide-react";
import { Link } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useLocation, useNavigate } from "react-router-dom";

interface AmisPageHeaderProps {
  user: User | null;
  loading: boolean;
  children?: React.ReactNode;
}

const AmisPageHeader: React.FC<AmisPageHeaderProps> = ({ user, loading, children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  
  // Déterminer quel onglet est actif
  const getActiveTab = () => {
    if (currentPath.includes("/messages")) return "messages";
    if (currentPath.includes("/mies")) return "mies";
    if (currentPath.includes("/vetements-amis")) return "vetements-amis";
    if (currentPath.includes("/ensembles-amis")) return "ensembles-amis";
    return "amis";
  };

  // Gérer le changement d'onglet
  const handleTabChange = (value: string) => {
    switch (value) {
      case "messages":
        navigate("/messages");
        break;
      case "mies":
        navigate("/mies");
        break;
      case "vetements-amis":
        navigate("/vetements-amis");
        break;
      case "ensembles-amis":
        navigate("/ensembles-amis");
        break;
      case "amis":
        navigate("/mes-amis");
        break;
    }
  };

  return (
    <div className="pt-24 pb-6 bg-accent/10">
      <div className="container mx-auto px-4">
        <Heading className="text-center">Mes Amis</Heading>
        <Text className="text-center text-muted-foreground max-w-2xl mx-auto mt-4">
          {user 
            ? "Retrouvez et gérez tous vos amis dans cette section."
            : "Connectez-vous pour voir et gérer vos amis."}
        </Text>
        
        {user && !loading && (
          <div className="mt-8 flex flex-col items-center">
            <Tabs defaultValue={getActiveTab()} className="w-full max-w-md" onValueChange={handleTabChange}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="amis" className="flex items-center justify-center">
                  <Users className="mr-2 h-4 w-4" />
                  Amis
                </TabsTrigger>
                <TabsTrigger value="vetements-amis" className="flex items-center justify-center">
                  <Shirt className="mr-2 h-4 w-4" />
                  Vêtements
                </TabsTrigger>
                <TabsTrigger value="ensembles-amis" className="flex items-center justify-center">
                  <List className="mr-2 h-4 w-4" />
                  Ensembles
                </TabsTrigger>
                <TabsTrigger value="messages" className="flex items-center justify-center">
                  <Mail className="mr-2 h-4 w-4" />
                  Messages
                </TabsTrigger>
                <TabsTrigger value="mies" className="flex items-center justify-center">
                  <Clock className="mr-2 h-4 w-4" />
                  En attente
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        )}
        
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
  );
};

export default AmisPageHeader;

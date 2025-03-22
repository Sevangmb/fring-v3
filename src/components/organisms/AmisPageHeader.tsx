
import React from "react";
import { Heading, Text } from "@/components/atoms/Typography";
import { Button } from "@/components/ui/button";
import { LogIn, Mail, Users, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation } from "react-router-dom";

interface AmisPageHeaderProps {
  user: User | null;
  loading: boolean;
}

const AmisPageHeader: React.FC<AmisPageHeaderProps> = ({ user, loading }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Déterminer quel onglet est actif
  const getActiveTab = () => {
    if (currentPath.includes("/messages")) return "messages";
    if (currentPath.includes("/mies")) return "mies";
    return "amis";
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
            <Tabs defaultValue={getActiveTab()} className="w-full max-w-md">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="amis" asChild>
                  <Link to="/mes-amis" className="flex items-center justify-center">
                    <Users className="mr-2 h-4 w-4" />
                    Amis
                  </Link>
                </TabsTrigger>
                <TabsTrigger value="messages" asChild>
                  <Link to="/messages" className="flex items-center justify-center">
                    <Mail className="mr-2 h-4 w-4" />
                    Messages
                  </Link>
                </TabsTrigger>
                <TabsTrigger value="mies" asChild>
                  <Link to="/mies" className="flex items-center justify-center">
                    <Clock className="mr-2 h-4 w-4" />
                    En attente
                  </Link>
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

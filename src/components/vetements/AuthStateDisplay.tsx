
import React from "react";
import { Link } from "react-router-dom";
import { Heading, Text } from "@/components/atoms/Typography";
import { Button } from "@/components/ui/button";
import { LogIn, Loader2 } from "lucide-react";
import Layout from "@/components/templates/Layout";

interface AuthLoadingProps {
  loading: boolean;
}

export const AuthLoading: React.FC<AuthLoadingProps> = ({ loading }) => {
  if (!loading) return null;
  
  return (
    <Layout>
      <div className="pt-24 flex items-center justify-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-64 bg-muted rounded-lg"></div>
          <div className="h-4 w-48 bg-muted rounded-lg mx-auto"></div>
        </div>
      </div>
    </Layout>
  );
};

export const NotAuthenticated: React.FC = () => {
  return (
    <Layout>
      <div className="pt-24 pb-6 bg-accent/10">
        <div className="container mx-auto px-4 text-center">
          <Heading>Ajout de vêtement</Heading>
          <Text className="text-muted-foreground max-w-2xl mx-auto mt-4">
            Vous devez être connecté pour ajouter un vêtement à votre collection.
          </Text>
          <div className="mt-8">
            <Button asChild>
              <Link to="/login">
                <LogIn className="mr-2 h-4 w-4" />
                Se connecter
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

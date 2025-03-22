
import React from "react";
import { Heading, Text } from "@/components/atoms/Typography";
import { Button } from "@/components/ui/button";
import { LogIn, Mail, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { User } from "@supabase/supabase-js";

interface AmisPageHeaderProps {
  user: User | null;
  loading: boolean;
}

const AmisPageHeader: React.FC<AmisPageHeaderProps> = ({ user, loading }) => {
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
          <div className="flex justify-center gap-4 mt-8">
            <Button asChild variant="default">
              <Link to="/messages">
                <Mail className="mr-2 h-4 w-4" />
                Messages
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/mies">
                <Users className="mr-2 h-4 w-4" />
                Mies
              </Link>
            </Button>
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

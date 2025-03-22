
import React from "react";
import { Heading, Text } from "@/components/atoms/Typography";
import { Button } from "@/components/ui/button";
import { LogIn, Mail, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";

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
          <div className="mt-8 flex flex-col items-center gap-4">
            <Menubar className="mx-auto">
              <MenubarMenu>
                <MenubarTrigger className="font-semibold">
                  <Mail className="mr-2 h-4 w-4" />
                  Menu de Navigation
                </MenubarTrigger>
                <MenubarContent>
                  <MenubarItem asChild>
                    <Link to="/messages" className="flex items-center">
                      <Mail className="mr-2 h-4 w-4" />
                      Messages
                    </Link>
                  </MenubarItem>
                  <MenubarItem asChild>
                    <Link to="/mies" className="flex items-center">
                      <Users className="mr-2 h-4 w-4" />
                      Mies
                    </Link>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
            
            <div className="flex justify-center gap-4">
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

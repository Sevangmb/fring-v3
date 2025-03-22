
import React from 'react';
import { useNavigate, Link } from "react-router-dom";
import { Heading, Text } from "@/components/atoms/Typography";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LogIn, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface VetementsPageHeaderProps {
  isAuthenticated: boolean;
  viewMode: 'mes-vetements' | 'vetements-amis';
  selectedFriendEmail?: string;
  hideHeading?: boolean;
}

const VetementsPageHeader: React.FC<VetementsPageHeaderProps> = ({ 
  isAuthenticated,
  viewMode,
  selectedFriendEmail,
  hideHeading = false
}) => {
  const navigate = useNavigate();

  return (
    <div className="pt-24 pb-6 bg-accent/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/mes-vetements")}
            className="rounded-full"
          >
            <ArrowLeft size={20} />
          </Button>
          {!hideHeading && <Heading>Liste des vêtements</Heading>}
          
          {viewMode === 'vetements-amis' && selectedFriendEmail && (
            <Badge variant="secondary" className="ml-2 flex items-center gap-1">
              <User size={12} />
              {selectedFriendEmail}
            </Badge>
          )}
        </div>
        {!hideHeading && (
          <Text className="text-muted-foreground max-w-2xl mt-4">
            {isAuthenticated 
              ? viewMode === 'mes-vetements' 
                ? "Consultez tous vos vêtements et gérez votre collection."
                : selectedFriendEmail 
                  ? `Parcourez les vêtements partagés par ${selectedFriendEmail}.`
                  : "Parcourez les vêtements partagés par vos amis."
              : "Connectez-vous pour voir et gérer vos vêtements."}
          </Text>
        )}
        
        {!isAuthenticated && (
          <div className="mt-8">
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

export default VetementsPageHeader;

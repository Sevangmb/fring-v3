
import React from 'react';
import { useNavigate, Link } from "react-router-dom";
import { Heading, Text } from "@/components/atoms/Typography";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LogIn, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface VetementsPageHeaderProps {
  isAuthenticated: boolean;
  viewMode?: 'mes-vetements' | 'vetements-amis';
  selectedFriendEmail?: string;
  hideHeading?: boolean;
  className?: string;
  title?: string;
  description?: string;
}

const VetementsPageHeader: React.FC<VetementsPageHeaderProps> = ({
  isAuthenticated,
  viewMode = 'mes-vetements',
  selectedFriendEmail,
  hideHeading = false,
  className,
  title,
  description
}) => {
  const navigate = useNavigate();
  
  return (
    <div className={`pt-24 pb-6 bg-accent/10 ${className || ''}`}>
      <div className="container mx-auto px-4">
        {title && !hideHeading && (
          <Heading level="h1" className="text-3xl font-bold">{title}</Heading>
        )}
        
        {!hideHeading && (
          <Text className="text-muted-foreground max-w-2xl mt-4">
            {description || (isAuthenticated 
              ? viewMode === 'mes-vetements' 
                ? "Consultez tous vos vêtements et gérez votre collection." 
                : selectedFriendEmail 
                  ? `Parcourez les vêtements partagés par ${selectedFriendEmail}.` 
                  : "Parcourez les vêtements partagés par vos amis." 
              : "Connectez-vous pour voir et gérer vos vêtements.")}
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

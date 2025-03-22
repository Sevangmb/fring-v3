
import React from 'react';
import { useNavigate, Link } from "react-router-dom";
import { Heading, Text } from "@/components/atoms/Typography";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LogIn, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface VetementsPageHeaderProps {
  title?: string;
  description?: string;
  isAuthenticated: boolean;
  viewMode?: 'mes-vetements' | 'vetements-amis';
  selectedFriendEmail?: string;
  hideHeading?: boolean;
  className?: string;
}

const VetementsPageHeader: React.FC<VetementsPageHeaderProps> = ({
  title = "Mes Vêtements",
  description,
  isAuthenticated,
  viewMode = 'mes-vetements',
  selectedFriendEmail,
  hideHeading = false,
  className
}) => {
  const navigate = useNavigate();

  return (
    <div className={`pt-6 pb-6 ${className || ''}`}>
      <div className="container mx-auto px-4">
        {!hideHeading && (
          <Heading as="h1" className="mb-2">
            {title}
          </Heading>
        )}
        
        {description && !hideHeading && (
          <Text className="text-muted-foreground max-w-2xl mt-4">
            {description}
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

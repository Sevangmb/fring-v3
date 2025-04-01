
import React from "react";
import { cn } from "@/lib/utils";
import { Heading, Text } from "../atoms/Typography";
import Card, { CardHeader, CardTitle, CardDescription } from "../molecules/Card";
import { Shirt, ShoppingBag, Zap, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface ClothingItemProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  delay?: number;
  link: string;
}

const ClothingItem = ({
  title,
  description,
  icon,
  delay = 0,
  link
}: ClothingItemProps) => {
  return (
    <Card className="h-full animate-slide-up" hoverable style={{
      animationDelay: `${delay}ms`
    }}>
      <CardHeader>
        <div className="h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center text-primary mb-4">
          {icon}
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        
        <div className="mt-4">
          <Button asChild variant="outline">
            <Link to={link}>Voir {title}</Link>
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
};

interface MesVetementsProps {
  className?: string;
  isAuthenticated: boolean;
}

const MesVetements = ({
  className,
  isAuthenticated
}: MesVetementsProps) => {
  if (!isAuthenticated) {
    return null;
  }

  const features = [
    {
      title: "Mes Vêtements",
      description: "Gérez votre garde-robe virtuelle et organisez vos vêtements par catégories.",
      icon: <Shirt size={24} />,
      link: "/mes-vetements"
    },
    {
      title: "Mes Ensembles",
      description: "Créez et sauvegardez des tenues complètes en combinant vos vêtements préférés.",
      icon: <ShoppingBag size={24} />,
      link: "/ensembles" 
    },
    {
      title: "Suggestions",
      description: "Recevez des suggestions de tenues basées sur la météo et vos préférences.",
      icon: <Zap size={24} />,
      link: "/suggestions"
    },
    {
      title: "Messages",
      description: "Discutez avec vos amis et partagez vos idées de tenues.",
      icon: <MessageSquare size={24} />,
      link: "/messages"
    }
  ];

  return (
    <div className={cn("py-10", className)}>
      <div className="container mx-auto px-4">
        <Heading as="h2" className="text-center mb-4">Votre Espace Personnel</Heading>
        <Text className="text-center text-muted-foreground mb-8">
          Gérez tous les aspects de votre garde-robe virtuelle en un seul endroit
        </Text>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <ClothingItem
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              delay={index * 100}
              link={feature.link}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MesVetements;

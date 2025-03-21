
import React from "react";
import { cn } from "@/lib/utils";
import { Heading, Text } from "../atoms/Typography";
import Card, { CardHeader, CardTitle, CardDescription } from "../molecules/Card";
import { Shirt, ShoppingBag, ShoppingCart, Zap, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface ClothingItemProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  delay?: number;
}

const ClothingItem = ({ title, description, icon, delay = 0 }: ClothingItemProps) => {
  return (
    <Card
      className="h-full animate-slide-up"
      hoverable
      style={{ animationDelay: `${delay}ms` }}
    >
      <CardHeader>
        <div className="h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center text-primary mb-4">
          {icon}
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  );
};

interface MesVetementsProps {
  className?: string;
  isAuthenticated: boolean;
}

const MesVetements = ({ className, isAuthenticated }: MesVetementsProps) => {
  const clothingItems = [
    {
      icon: <Shirt size={24} />,
      title: "T-shirts",
      description: "Collection de t-shirts modernes et confortables pour toutes les occasions.",
    },
    {
      icon: <ShoppingBag size={24} />,
      title: "Pantalons",
      description: "Des pantalons élégants et durables, parfaits pour le quotidien ou les événements spéciaux.",
    },
    {
      icon: <Zap size={24} />,
      title: "Accessoires",
      description: "Complétez votre tenue avec notre gamme d'accessoires tendance.",
    },
    {
      icon: <ShoppingCart size={24} />,
      title: "Nouveautés",
      description: "Découvrez nos dernières collections et restez à la pointe de la mode.",
    },
  ];

  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <Text 
            variant="subtle" 
            className="uppercase tracking-wider font-medium mb-3 animate-fade-in"
          >
            {isAuthenticated ? "Ma Collection" : "Découvrez nos collections"}
          </Text>
          <Heading className="mb-6 animate-slide-up">
            {isAuthenticated 
              ? "Découvrez votre sélection de vêtements" 
              : "Connectez-vous pour voir vos vêtements"}
          </Heading>
          <Text 
            variant="lead" 
            className="text-muted-foreground animate-slide-up"
            style={{ animationDelay: "100ms" }}
          >
            {isAuthenticated 
              ? "Votre garde-robe personnelle vous permet de visualiser et gérer tous vos vêtements." 
              : "Créez un compte ou connectez-vous pour accéder à votre collection personnelle de vêtements."}
          </Text>
          
          {!isAuthenticated && (
            <Button asChild className="mt-6 animate-slide-up" style={{ animationDelay: "200ms" }}>
              <Link to="/login">
                <LogIn className="mr-2 h-4 w-4" />
                Se connecter
              </Link>
            </Button>
          )}
        </div>

        {isAuthenticated ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {clothingItems.map((item, index) => (
              <ClothingItem
                key={index}
                title={item.title}
                description={item.description}
                icon={item.icon}
                delay={index * 100}
              />
            ))}
          </div>
        ) : (
          <div className="bg-accent/10 p-10 rounded-lg text-center animate-fade-in">
            <Shirt size={48} className="mx-auto text-muted-foreground mb-4" />
            <Heading as="h3" variant="h4" className="mb-2">Connectez-vous pour voir vos vêtements</Heading>
            <Text className="text-muted-foreground max-w-md mx-auto mb-6">
              Notre application vous permet de créer une collection personnelle de vêtements
              accessible uniquement à vous.
            </Text>
          </div>
        )}
      </div>
    </section>
  );
};

export default MesVetements;

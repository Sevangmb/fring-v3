
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

const ClothingItem = ({
  title,
  description,
  icon,
  delay = 0
}: ClothingItemProps) => {
  return <Card className="h-full animate-slide-up" hoverable style={{
    animationDelay: `${delay}ms`
  }}>
      <CardHeader>
        <div className="h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center text-primary mb-4">
          {icon}
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>;
};

interface MesVetementsProps {
  className?: string;
  isAuthenticated: boolean;
}

const MesVetements = ({
  className,
  isAuthenticated
}: MesVetementsProps) => {
  const clothingItems = [{
    icon: <Shirt size={24} />,
    title: "T-shirts",
    description: "Collection de t-shirts modernes et confortables pour toutes les occasions."
  }, {
    icon: <ShoppingBag size={24} />,
    title: "Pantalons",
    description: "Des pantalons élégants et durables, parfaits pour le quotidien ou les événements spéciaux."
  }, {
    icon: <Zap size={24} />,
    title: "Accessoires",
    description: "Complétez votre tenue avec notre gamme d'accessoires tendance."
  }, {
    icon: <ShoppingCart size={24} />,
    title: "Nouveautés",
    description: "Découvrez nos dernières collections et restez à la pointe de la mode."
  }];

  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Heading variant="h2" className="mb-4">Explorez Votre Garde-Robe</Heading>
          <Text variant="lead" className="mx-auto max-w-3xl">
            Parcourez votre collection de vêtements et créez des ensembles stylés pour toutes les occasions.
          </Text>
        </div>

        {isAuthenticated ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {clothingItems.map((item, index) => (
              <Link to="/mes-vetements" key={index} className="block h-full">
                <ClothingItem 
                  title={item.title}
                  description={item.description}
                  icon={item.icon}
                  delay={index * 100}
                />
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center">
            <Text className="mb-6">
              Connectez-vous pour gérer votre garde-robe et créer des ensembles stylés.
            </Text>
            <Button asChild>
              <Link to="/login" className="inline-flex items-center">
                <LogIn className="mr-2 h-4 w-4" />
                Se connecter
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default MesVetements;


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
    <section className={cn("py-16", className)}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Heading as="h2" className="text-3xl font-bold mb-3">
            Vêtements populaires
          </Heading>
          <Text className="text-muted-foreground max-w-2xl mx-auto">
            Découvrez notre sélection de vêtements les plus populaires. Qualité, style et confort au meilleur prix.
          </Text>
        </div>

        {isAuthenticated ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-8 text-center">
            <LogIn size={48} className="mx-auto mb-4 text-gray-400" />
            <Heading as="h3" className="text-xl font-semibold mb-2">
              Connectez-vous pour voir vos vêtements
            </Heading>
            <Text className="text-muted-foreground mb-4">
              Créez votre garde-robe virtuelle et organisez vos tenues facilement.
            </Text>
            <div className="flex justify-center gap-4">
              <Button asChild variant="outline">
                <Link to="/login">Se connecter</Link>
              </Button>
              <Button asChild>
                <Link to="/register">S'inscrire</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default MesVetements;

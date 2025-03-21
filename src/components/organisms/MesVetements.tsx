
import React from "react";
import { cn } from "@/lib/utils";
import { Heading, Text } from "../atoms/Typography";
import Card, { CardHeader, CardTitle, CardDescription } from "../molecules/Card";
import { Shirt, ShoppingBag, ShoppingCart, Zap } from "lucide-react";

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
}

const MesVetements = ({ className }: MesVetementsProps) => {
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
            Ma Collection
          </Text>
          <Heading className="mb-6 animate-slide-up">
            Découvrez notre sélection de vêtements
          </Heading>
          <Text 
            variant="lead" 
            className="text-muted-foreground animate-slide-up"
            style={{ animationDelay: "100ms" }}
          >
            Notre boutique vous propose une variété de vêtements de qualité pour toutes les saisons et tous les styles.
          </Text>
        </div>

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
      </div>
    </section>
  );
};

export default MesVetements;

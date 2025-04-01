
import React from "react";
import Layout from "@/components/templates/Layout";
import PageHeader from "@/components/organisms/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Shirt, Umbrella, Users, Zap, Eye, MessageSquare, Award, Search } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Heading, Text } from "@/components/atoms/Typography";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
  delay?: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  className,
  delay = 0
}) => {
  return (
    <Card 
      className={cn(
        "h-full animate-fade-in", 
        className
      )}
      style={{
        animationDelay: `${delay}ms`
      }}
    >
      <CardContent className="p-6">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
          {icon}
        </div>
        <Heading as="h3" className="text-xl font-semibold mb-2">{title}</Heading>
        <Text className="text-muted-foreground">{description}</Text>
      </CardContent>
    </Card>
  );
};

const Features: React.FC = () => {
  const features = [
    {
      title: "Gérez votre garde-robe",
      description: "Ajoutez, organisez et retrouvez facilement tous vos vêtements dans un seul endroit numérique.",
      icon: <Shirt size={24} />,
    },
    {
      title: "Suggestions météo",
      description: "Recevez des suggestions de tenues adaptées à la météo du jour et aux prévisions.",
      icon: <Umbrella size={24} />,
    },
    {
      title: "Partagez avec vos amis",
      description: "Connectez-vous avec vos amis et partagez vos tenues préférées pour recevoir leurs avis.",
      icon: <Users size={24} />,
    },
    {
      title: "Ensembles personnalisés",
      description: "Créez des ensembles avec vos vêtements pour préparer vos tenues à l'avance.",
      icon: <Zap size={24} />,
    },
    {
      title: "Découvrez les tendances",
      description: "Explorez les tenues et les styles populaires parmi la communauté Fring.",
      icon: <Eye size={24} />,
    },
    {
      title: "Communication simplifiée",
      description: "Discutez de mode et échangez des conseils avec d'autres utilisateurs.",
      icon: <MessageSquare size={24} />,
    },
    {
      title: "Défis de style",
      description: "Participez à des défis de style hebdomadaires et gagnez des badges exclusifs.",
      icon: <Award size={24} />,
    },
    {
      title: "Recherche intelligente",
      description: "Trouvez rapidement des vêtements par couleur, type, saison ou occasion.",
      icon: <Search size={24} />,
    }
  ];

  return (
    <Layout>
      <PageHeader 
        title="Fonctionnalités" 
        description="Découvrez toutes les fonctionnalités que Fring vous offre pour gérer votre garde-robe et votre style"
      />
      
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              delay={index * 100}
            />
          ))}
        </div>
        
        <Separator className="my-12" />
        
        <div className="text-center max-w-2xl mx-auto">
          <Heading as="h2" className="text-2xl font-bold mb-4">
            Prêt à essayer Fring ?
          </Heading>
          <Text className="text-muted-foreground mb-6">
            Rejoignez des milliers d'utilisateurs qui ont déjà transformé leur expérience vestimentaire avec Fring.
          </Text>
          <div className="flex justify-center gap-4">
            <a 
              href="/register" 
              className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              S'inscrire gratuitement
            </a>
            <a 
              href="/login" 
              className="px-6 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
            >
              Se connecter
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Features;

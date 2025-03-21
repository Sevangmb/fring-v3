
import React from "react";
import { cn } from "@/lib/utils";
import { Heading, Text } from "../atoms/Typography";
import Card, { CardHeader, CardTitle, CardDescription } from "../molecules/Card";
import { Shield, Users, Zap, LayoutGrid } from "lucide-react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  delay?: number;
}

const FeatureCard = ({ title, description, icon, delay = 0 }: FeatureCardProps) => {
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

interface FeaturesProps {
  className?: string;
}

const Features = ({ className }: FeaturesProps) => {
  const features = [
    {
      icon: <Users size={24} />,
      title: "Multi-User Collaboration",
      description: "Work together seamlessly with real-time updates and collaborative editing features.",
    },
    {
      icon: <Zap size={24} />,
      title: "Lightning Fast Performance",
      description: "Enjoy blazing fast load times and responsive interactions across all devices.",
    },
    {
      icon: <Shield size={24} />,
      title: "Enterprise-Grade Security",
      description: "Rest easy with our robust security protocols and data encryption standards.",
    },
    {
      icon: <LayoutGrid size={24} />,
      title: "Atomic Design Architecture",
      description: "Built with scalable components following modern design principles for easy maintenance.",
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
            Key Features
          </Text>
          <Heading className="mb-6 animate-slide-up">
            Everything you need to build amazing products
          </Heading>
          <Text 
            variant="lead" 
            className="text-muted-foreground animate-slide-up"
            style={{ animationDelay: "100ms" }}
          >
            Our platform provides all the essential tools and features to help you create exceptional user experiences without the complexity.
          </Text>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
      </div>
    </section>
  );
};

export default Features;

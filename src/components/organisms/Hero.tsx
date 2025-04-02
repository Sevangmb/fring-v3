
import React from "react";
import { cn } from "@/lib/utils";
import { Heading, Text } from "../atoms/Typography";
import Button from "../atoms/Button";
import { ArrowRight, Sun, CloudSun, CloudRain } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface HeroProps {
  className?: string;
}

const Hero = ({ className }: HeroProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const handleGetStarted = () => navigate("/register");
  const handleLearnMore = () => navigate("/features");
  const handleViewDashboard = () => navigate("/vetements");

  return (
    <section className={cn("relative overflow-hidden pt-20 pb-16 md:pt-24 md:pb-20 lg:pt-32 lg:pb-24", className)}>
      <div className="absolute inset-0 bg-gradient-to-b from-background to-background/80 -z-10"></div>
      
      <div className="container mx-auto px-4 flex flex-col items-center text-center">
        <div className="flex items-center justify-center mb-6 space-x-2">
          <CloudSun className="h-10 w-10 text-sky-400" />
          <CloudRain className="h-10 w-10 text-blue-500" />
          <Sun className="h-10 w-10 text-amber-400" />
        </div>
        
        <Heading className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 max-w-4xl">
          Gérez votre garde-robe selon le temps
        </Heading>
        
        <Text className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl">
          Optimisez votre style quotidien avec des recommendations basées sur la météo. 
          Ne laissez plus la pluie ou le soleil vous surprendre !
        </Text>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {!user ? (
            <>
              <Button onClick={handleGetStarted} className="px-8 py-2 text-lg">
                Commencer <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" onClick={handleLearnMore} className="px-8 py-2 text-lg">
                En savoir plus
              </Button>
            </>
          ) : (
            <Button onClick={handleViewDashboard} className="px-8 py-2 text-lg">
              Voir mes vêtements <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          )}
        </div>
        
        <div className="mt-16 bg-card rounded-xl p-6 shadow-lg max-w-lg w-full">
          <div className="inline-block bg-primary/10 rounded-lg px-3 py-1 text-primary text-sm font-medium mb-4">
            Météo Intelligente
          </div>
          <Text className="font-medium text-xl mb-2">Suggestions de tenues personnalisées</Text>
          <Text className="text-muted-foreground mb-4">
            Notre application analyse les conditions météorologiques et votre garde-robe pour vous suggérer la tenue parfaite.
          </Text>
          
          <img 
            src="/lovable-uploads/375c0bdb-76f7-4e16-ad2e-eeef3e06e5c9.png" 
            alt="Météo et vêtements"
            className="rounded-lg w-16 h-16 mx-auto opacity-75"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;

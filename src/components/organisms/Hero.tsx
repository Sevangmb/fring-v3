
import React from "react";
import { cn } from "@/lib/utils";
import { Heading, Text } from "../atoms/Typography";
import Button from "../atoms/Button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface HeroProps {
  className?: string;
}

const Hero = ({ className }: HeroProps) => {
  return (
    <section className={cn("relative overflow-hidden pt-20 md:pt-24 lg:pt-32", className)}>
      <div className="absolute inset-0 bg-gradient-to-b from-background to-background/80 -z-10"></div>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-6 animate-fade-in">
            Welcome to AppName
          </span>
          <Heading 
            variant="h1" 
            className="mb-6 animate-slide-up"
          >
            Create amazing experiences with our intuitive platform
          </Heading>
          
          <Text 
            variant="lead" 
            className="text-muted-foreground mb-8 animate-slide-up"
            style={{ animationDelay: "100ms" }}
          >
            Discover a modern approach to multi-user application development. 
            Build faster, scale easily, and deliver exceptional user experiences.
          </Text>
          
          <div 
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-slide-up"
            style={{ animationDelay: "200ms" }}
          >
            <Button size="lg" asChild>
              <Link to="/register">
                Get started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/features">Learn more</Link>
            </Button>
          </div>
          
          <div 
            className="mt-12 relative w-full max-w-5xl animate-slide-up"
            style={{ animationDelay: "300ms" }}
          >
            <div className="aspect-[16/9] bg-gradient-to-tr from-primary/20 to-secondary/30 rounded-lg shadow-lg overflow-hidden">
              {/* Placeholder for a screenshot or illustration */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Text className="text-muted-foreground">Application Screenshot</Text>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -z-10 w-24 h-24 bg-primary/10 rounded-full -top-12 -right-12 animate-float"></div>
            <div className="absolute -z-10 w-16 h-16 bg-primary/5 rounded-full -bottom-8 -left-8 animate-float" style={{ animationDelay: "1s" }}></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

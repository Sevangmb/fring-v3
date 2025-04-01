
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
  // Ne rien afficher, composant caché
  return null;
};

export default MesVetements;

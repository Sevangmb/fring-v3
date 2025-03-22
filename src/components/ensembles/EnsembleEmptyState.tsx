
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/atoms/Typography";
import { ListPlus, ArrowRight } from "lucide-react";

const EnsembleEmptyState: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <Card className="text-center py-12 shadow-md border-primary/10">
      <CardContent className="flex flex-col items-center space-y-4">
        <ListPlus className="h-16 w-16 text-muted-foreground mb-2" />
        <Heading className="text-xl">Aucun vêtement disponible</Heading>
        <span className="text-muted-foreground mb-4 max-w-md">
          Ajoutez d'abord quelques vêtements à votre garde-robe pour pouvoir créer des ensembles.
        </span>
        <Button size="lg" onClick={() => navigate("/mes-vetements/ajouter")} className="gap-2">
          Ajouter un vêtement
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default EnsembleEmptyState;

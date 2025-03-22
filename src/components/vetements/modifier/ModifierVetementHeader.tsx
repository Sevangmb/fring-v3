
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Heading, Text } from "@/components/atoms/Typography";
import { Button } from "@/components/ui/button";

const ModifierVetementHeader = () => {
  const navigate = useNavigate();
  
  return (
    <div className="pt-24 pb-6 bg-accent/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/mes-vetements/liste")}
            className="rounded-full"
          >
            <ArrowLeft size={20} />
          </Button>
          <Heading>Modifier un vêtement</Heading>
        </div>
        <Text className="text-muted-foreground max-w-2xl mt-4">
          Modifiez les informations de votre vêtement et enregistrez les changements.
        </Text>
      </div>
    </div>
  );
};

export default ModifierVetementHeader;


import React from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface VetementItemProps {
  name: string;
  brand: string;
  index: number;
}

export const VetementItem: React.FC<VetementItemProps> = ({ name, brand, index }) => (
  <div className="mb-5">
    <div className="text-sm text-muted-foreground font-medium">{index}</div>
    <Card className="p-4 bg-card shadow-sm border-border/30">
      <div className="font-medium text-foreground">{name}</div>
      <div className="text-sm text-muted-foreground">{brand}</div>
    </Card>
  </div>
);

interface VetementsListProps {
  vetements: any[];
}

const VetementsList: React.FC<VetementsListProps> = ({ vetements }) => {
  return (
    <ScrollArea className="mt-4 max-h-60 rounded-md">
      {vetements.length > 0 ? (
        vetements.map((item: any, index: number) => (
          <VetementItem 
            key={item.id}
            name={item.vetement?.nom || "Vêtement sans nom"}
            brand={item.vetement?.marque || ""}
            index={index + 1}
          />
        ))
      ) : (
        <div className="text-center py-6 text-muted-foreground">
          Cet ensemble ne contient aucun vêtement.
        </div>
      )}
    </ScrollArea>
  );
};

export default VetementsList;


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/atoms/Typography";
import { DefiCardProps } from "./types";

const DefiCard: React.FC<DefiCardProps> = ({
  title,
  description,
  type = "current"
}) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Text>{description}</Text>
        <div className="mt-4 text-xs text-muted-foreground">
          {type === "upcoming" ? "À venir" : type === "past" ? "Passé" : "En cours"}
        </div>
      </CardContent>
    </Card>
  );
};

export default DefiCard;


import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/atoms/Typography";
import { Button } from "@/components/ui/button";
import { Award, Calendar, ChevronRight, Flag } from "lucide-react";

export type DefiType = "current" | "upcoming" | "past";

export interface DefiCardProps {
  title: string;
  description: string;
  dateRange: string;
  type: DefiType;
  icon?: React.ReactNode;
  participantsCount?: number;
}

const DefiCard: React.FC<DefiCardProps> = ({
  title,
  description,
  dateRange,
  type,
  icon = <Flag className="h-5 w-5" />,
  participantsCount
}) => {
  const isPast = type === "past";
  const isUpcoming = type === "upcoming";

  return (
    <Card className={`overflow-hidden hover:shadow-md transition-all duration-300 ${isPast ? "opacity-80" : ""}`}>
      <CardHeader className={`${
        isUpcoming ? "bg-secondary/10" : isPast ? "bg-muted" : "bg-primary/10"
      } p-4 border-b flex items-center gap-2`}>
        {React.cloneElement(icon as React.ReactElement, {
          className: `h-5 w-5 ${isUpcoming ? "text-secondary" : isPast ? "" : "text-primary"}`
        })}
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <Text>{description}</Text>
        <div className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>{dateRange}</span>
        </div>
      </CardContent>
      <CardFooter className="border-t p-3 bg-muted/20">
        {isPast ? (
          <>
            <Text className="text-sm text-muted-foreground">
              <Award className="h-4 w-4 inline mr-1" />
              {participantsCount} participants
            </Text>
            <Button variant="outline" size="sm" className="ml-auto">
              Voir les résultats
            </Button>
          </>
        ) : isUpcoming ? (
          <Button variant="outline" size="sm" className="ml-auto flex items-center gap-1 opacity-70" disabled>
            Bientôt disponible <Calendar className="h-3 w-3" />
          </Button>
        ) : (
          <Button variant="outline" size="sm" className="ml-auto flex items-center gap-1">
            Participer <ChevronRight className="h-3 w-3" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default DefiCard;


import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Award, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export type DefiType = "current" | "upcoming" | "past";

export interface DefiCardProps {
  id: number;
  title: string;
  description: string;
  dateRange: string;
  type: DefiType;
  icon?: React.ReactNode;
  participantsCount?: number;
  onParticipation?: () => void;
  ensembleId?: number;
}

const DefiCard: React.FC<DefiCardProps> = ({
  id,
  title,
  description,
  dateRange,
  type,
  icon = <Calendar className="h-5 w-5" />,
  participantsCount = 0,
  onParticipation,
  ensembleId
}) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/defis/${id}`);
  };
  
  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <Badge 
            variant={type === "current" ? "default" : type === "upcoming" ? "secondary" : "outline"}
            className="mb-2"
          >
            {type === "current" ? "En cours" : type === "upcoming" ? "À venir" : "Terminé"}
          </Badge>
        </div>
        <CardTitle className="line-clamp-1">{title}</CardTitle>
        <CardDescription className="flex items-center gap-1 text-xs">
          {icon}
          <span>{dateRange}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-gray-600 line-clamp-3">{description}</p>
        
        {type === "current" && ensembleId && (
          <div className="mt-3">
            <Badge variant="success" className="bg-green-100 text-green-800 hover:bg-green-200">
              Vous participez
            </Badge>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between pt-2 border-t text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Users className="h-4 w-4" />
          <span>{participantsCount} participant{participantsCount !== 1 ? 's' : ''}</span>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-primary" 
          onClick={handleClick}
        >
          Voir <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DefiCard;

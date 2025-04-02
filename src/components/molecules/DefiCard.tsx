import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Clock, Calendar, User, Award, Flag } from "lucide-react";
import { formatDistanceToNow, format, parseISO, isAfter, isBefore, isToday } from "date-fns";
import { fr } from "date-fns/locale";

interface DefiCardProps {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'current' | 'upcoming' | 'past';
  participantsCount: number;
  createdBy?: string;
  onParticipate?: () => void;
  onViewDetails?: () => void;
}

const DefiCard: React.FC<DefiCardProps> = ({
  id,
  title,
  description,
  startDate,
  endDate,
  status,
  participantsCount,
  createdBy,
  onParticipate,
  onViewDetails
}) => {
  // Calcul des dates formatées
  const start = parseISO(startDate);
  const end = parseISO(endDate);
  const formattedStartDate = format(start, 'dd MMM yyyy', { locale: fr });
  const formattedEndDate = format(end, 'dd MMM yyyy', { locale: fr });
  const timeUntilStart = formatDistanceToNow(start, { addSuffix: true, locale: fr });
  const timeUntilEnd = formatDistanceToNow(end, { addSuffix: true, locale: fr });
  
  // Déterminer le statut du badge
  const getBadgeVariant = () => {
    switch (status) {
      case 'current':
        return "default"; // Utiliser 'default' au lieu de 'success'
      case 'upcoming':
        return "secondary";
      case 'past':
        return "outline";
      default:
        return "default";
    }
  };
  
  return (
    <Card className="bg-card text-card-foreground shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold leading-none">{title}</h3>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <Badge variant={getBadgeVariant()}>
          {status === 'current' ? 'En cours' : status === 'upcoming' ? 'À venir' : 'Terminé'}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4 opacity-70" />
            <span className="text-xs text-muted-foreground">
              {status === 'current'
                ? `Se termine ${timeUntilEnd}`
                : status === 'upcoming'
                  ? `Débute ${timeUntilStart}`
                  : `Du ${formattedStartDate} au ${formattedEndDate}`}
            </span>
          </div>
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4 opacity-70" />
            <span className="text-xs text-muted-foreground">
              {`Du ${formattedStartDate} au ${formattedEndDate}`}
            </span>
          </div>
          <div className="flex items-center">
            <User className="mr-2 h-4 w-4 opacity-70" />
            <span className="text-xs text-muted-foreground">
              {`${participantsCount} participants`}
            </span>
          </div>
          {createdBy && (
            <div className="flex items-center">
              <Avatar className="mr-2 h-4 w-4">
                <AvatarImage src={`https://avatar.vercel.sh/${createdBy}.png`} alt={createdBy} />
                <AvatarFallback>{createdBy.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground">
                Créé par {createdBy}
              </span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {onParticipate && (
          <Button variant="outline" size="sm" onClick={onParticipate}>
            <Award className="mr-2 h-4 w-4" />
            Participer
          </Button>
        )}
        {onViewDetails && (
          <Button size="sm" onClick={onViewDetails}>
            Voir détails
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default DefiCard;

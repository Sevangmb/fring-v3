
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCheck, Shirt, CaseSensitive, Heart, Calendar, Clock } from "lucide-react";
import { Text } from "@/components/atoms/Typography";

interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  className?: string;
}

const StatItem: React.FC<StatItemProps> = ({ icon, label, value, className }) => (
  <div className={`flex flex-col items-center p-3 ${className}`}>
    <div className="mb-2 p-2 rounded-full bg-primary/10 text-primary">
      {icon}
    </div>
    <Text className="text-lg font-medium font-montserrat">{value}</Text>
    <Text variant="small" className="text-muted-foreground font-montserrat">{label}</Text>
  </div>
);

interface UserStatsProps {
  vetementCount: number;
  ensembleCount: number;
  friendsCount: number;
  favorisCount: number;
  memberSince: string;
  lastActive: string;
  isLoading: boolean;
}

const UserStats: React.FC<UserStatsProps> = ({
  vetementCount,
  ensembleCount,
  friendsCount,
  favorisCount,
  memberSince,
  lastActive,
  isLoading
}) => {
  if (isLoading) {
    return (
      <Card className="border border-primary/10 shadow-sm animate-pulse bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-montserrat">Mes statistiques</CardTitle>
          <CardDescription className="font-montserrat">Chargement...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-24 bg-muted/40 rounded-md"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-primary/10 shadow-sm animate-slide-up bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-montserrat flex items-center gap-2">
          <CaseSensitive size={16} className="text-primary" />
          Mes statistiques
        </CardTitle>
        <CardDescription className="font-montserrat">
          Vue d'ensemble de votre activité sur Fring
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <StatItem 
            icon={<Shirt size={18} />}
            label="Vêtements"
            value={vetementCount}
          />
          <StatItem 
            icon={<CaseSensitive size={18} />}
            label="Ensembles"
            value={ensembleCount}
          />
          <StatItem 
            icon={<UserCheck size={18} />}
            label="Amis"
            value={friendsCount}
          />
          <StatItem 
            icon={<Heart size={18} />}
            label="Favoris"
            value={favorisCount}
          />
          <StatItem 
            icon={<Calendar size={18} />}
            label="Membre depuis"
            value={memberSince}
          />
          <StatItem 
            icon={<Clock size={18} />}
            label="Dernière activité"
            value={lastActive}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default UserStats;

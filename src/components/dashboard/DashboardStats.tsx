
import React from "react";
import { Text } from "@/components/atoms/Typography";
import Card, { CardHeader } from "@/components/molecules/Card";

type StatCardProps = {
  title: string;
  value: string;
  description: string;
  color: string;
};

const StatCard = ({ title, value, description, color }: StatCardProps) => (
  <Card>
    <CardHeader>
      <Text variant="subtle" className="mb-1">{title}</Text>
      <Text variant="h3" weight="bold">{value}</Text>
      <Text variant="small" className={color}>{description}</Text>
    </CardHeader>
  </Card>
);

interface DashboardStatsProps {
  totalVetements: number;
  totalTenues: number;
  totalAmis: number;
}

const DashboardStats = ({ totalVetements, totalTenues, totalAmis }: DashboardStatsProps) => {
  // Formatage du texte de statistiques
  const formatStatText = (count: number, text: string) => {
    if (count === 0) return `Aucun ${text}`;
    if (count === 1) return `1 ${text}`;
    return `${count} ${text}s`;
  };

  const statsData = [
    {
      title: "Total Vêtements",
      value: formatStatText(totalVetements, "vêtement"),
      description: totalVetements > 0 
        ? "Votre garde-robe personnelle" 
        : "Ajoutez vos premiers vêtements",
      color: "bg-theme-blue-medium/10 text-theme-blue-medium",
    },
    {
      title: "Tenues Créées",
      value: formatStatText(totalTenues, "tenue"),
      description: totalTenues > 0 
        ? "Vos tenues personnalisées" 
        : "Commencez à créer des tenues",
      color: "bg-theme-turquoise/10 text-theme-turquoise",
    },
    {
      title: "Amis",
      value: formatStatText(totalAmis, "ami"),
      description: totalAmis > 0 
        ? "Vos relations établies" 
        : "Ajoutez des amis pour partager",
      color: "bg-theme-yellow/10 text-theme-yellow",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {statsData.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default DashboardStats;


import React from 'react';
import { CardFooter } from "@/components/molecules/Card";
import { Text } from "@/components/atoms/Typography";

interface VetementCardFooterProps {
  couleur: string;
  taille: string;
}

const VetementCardFooter: React.FC<VetementCardFooterProps> = ({ couleur, taille }) => {
  const getColorHex = (couleur: string): string => {
    const colorMap: Record<string, string> = {
      blanc: "#f8fafc",
      noir: "#1e293b",
      gris: "#94a3b8",
      bleu: "#3b82f6",
      rouge: "#ef4444",
      vert: "#22c55e",
      jaune: "#eab308",
      orange: "#f97316",
      violet: "#a855f7",
      rose: "#ec4899",
      marron: "#78350f",
      beige: "#ede9d9"
    };

    return colorMap[couleur] || "#cbd5e1"; // fallback for multicolore
  };

  return (
    <CardFooter className="flex justify-between items-center pt-0 pb-4 px-6">
      <div className="flex items-center gap-2">
        <div 
          className="h-4 w-4 rounded-full" 
          style={{ backgroundColor: getColorHex(couleur) }}
        />
        <Text variant="subtle" className="capitalize">
          {couleur}
        </Text>
      </div>
      <Text variant="subtle">{taille}</Text>
    </CardFooter>
  );
};

export default VetementCardFooter;

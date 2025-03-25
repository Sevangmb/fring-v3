
import React from "react";
import { CardContent } from "@/components/ui/card";
import { Text } from "@/components/atoms/Typography";
import { Calendar, Crown } from "lucide-react";

interface DefiCardContentProps {
  description: string;
  dateRange: string;
  isCurrent: boolean;
  leaderName: string | null;
}

const DefiCardContent: React.FC<DefiCardContentProps> = ({
  description,
  dateRange,
  isCurrent,
  leaderName
}) => {
  return (
    <CardContent className="p-4">
      <Text>{description}</Text>
      <div className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
        <Calendar className="h-4 w-4" />
        <span>{dateRange}</span>
      </div>
      {leaderName && isCurrent && (
        <div className="mt-2 flex items-center gap-1 text-sm text-amber-600 font-medium">
          <Crown className="h-4 w-4" />
          <span>En tête: {leaderName}</span>
        </div>
      )}
    </CardContent>
  );
};

export default DefiCardContent;

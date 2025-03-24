
import React from "react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { DefiType } from "./types";

interface DefiCardHeaderProps {
  title: string;
  type: DefiType;
  icon: React.ReactElement;
}

const DefiCardHeader: React.FC<DefiCardHeaderProps> = ({ title, type, icon }) => {
  const isUpcoming = type === "upcoming";
  const isPast = type === "past";

  return (
    <CardHeader className={`${
      isUpcoming ? "bg-secondary/10" : isPast ? "bg-muted" : "bg-primary/10"
    } p-4 border-b flex items-center gap-2`}>
      {React.cloneElement(icon, {
        className: `h-5 w-5 ${isUpcoming ? "text-secondary" : isPast ? "" : "text-primary"}`
      })}
      <CardTitle className="text-lg">{title}</CardTitle>
    </CardHeader>
  );
};

export default DefiCardHeader;

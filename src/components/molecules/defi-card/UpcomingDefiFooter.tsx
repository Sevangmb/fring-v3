
import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

const UpcomingDefiFooter: React.FC = () => {
  return (
    <Button variant="outline" size="sm" className="ml-auto flex items-center gap-1 opacity-70" disabled>
      Bientôt disponible <Calendar className="h-3 w-3" />
    </Button>
  );
};

export default UpcomingDefiFooter;

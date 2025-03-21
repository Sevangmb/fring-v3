
import React from "react";
import { Loader2 } from "lucide-react";

const DashboardLoader = () => {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <span className="ml-2">Chargement des statistiques...</span>
    </div>
  );
};

export default DashboardLoader;

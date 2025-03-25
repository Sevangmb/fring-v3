
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Heading } from "@/components/atoms/Typography";
import { Trophy } from "lucide-react";
import CreateDefiDialog from "../molecules/CreateDefiDialog";
import DefisTabContent from "./DefisTabContent";

const DefisSection: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  // Simulate loading data
  useEffect(() => {
    // Simulate API call with a delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [refreshKey]);

  const handleDefiCreated = () => {
    // Force a refresh of the DefisTabContent
    setIsLoading(true);
    setRefreshKey(prev => prev + 1);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy className="h-6 w-6 text-primary" />
            <Heading as="h2" variant="h3">Défis</Heading>
          </div>
          
          <CreateDefiDialog onDefiCreated={handleDefiCreated} />
        </div>
      </CardHeader>
      
      <CardContent className="p-6 pt-0">
        <DefisTabContent key={refreshKey} isLoading={isLoading} />
      </CardContent>
    </Card>
  );
};

export default DefisSection;

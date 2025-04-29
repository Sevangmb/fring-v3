
import React from 'react';
import Card from "@/components/molecules/Card";

interface VetementCardContainerProps {
  children: React.ReactNode;
}

const VetementCardContainer: React.FC<VetementCardContainerProps> = ({ children }) => {
  return (
    <div className="group relative h-full">
      <Card className="h-full flex flex-col shadow-sm hover:shadow-md transition-shadow relative">
        {children}
      </Card>
    </div>
  );
};

export default VetementCardContainer;

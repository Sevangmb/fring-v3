
import React from "react";
import { Heading, Text } from "@/components/atoms/Typography";

interface PageHeaderProps {
  title: string;
  description?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, description }) => {
  return (
    <div className="pt-24 pb-6 bg-accent/10">
      <div className="container mx-auto px-4">
        <Heading className="text-center">{title}</Heading>
        {description && (
          <Text className="text-center text-muted-foreground max-w-2xl mx-auto mt-4">
            {description}
          </Text>
        )}
      </div>
    </div>
  );
};

export default PageHeader;

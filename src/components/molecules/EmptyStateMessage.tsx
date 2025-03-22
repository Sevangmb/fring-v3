
import React from 'react';
import { Heading, Text } from "@/components/atoms/Typography";
import { Button } from "@/components/ui/button";
import { Shirt, Plus, LogIn, Users } from "lucide-react";

interface EmptyStateMessageProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  buttonIcon: React.ReactNode;
  onButtonClick: () => void;
}

const EmptyStateMessage: React.FC<EmptyStateMessageProps> = ({
  icon,
  title,
  description,
  buttonText,
  buttonIcon,
  onButtonClick
}) => {
  return (
    <div className="text-center py-16">
      <div className="mx-auto text-muted-foreground opacity-20 mb-4">
        {icon}
      </div>
      <Heading as="h3" variant="h4" className="mb-2">{title}</Heading>
      <Text className="text-muted-foreground mb-6">
        {description}
      </Text>
      <Button onClick={onButtonClick}>
        {buttonIcon}
        {buttonText}
      </Button>
    </div>
  );
};

export default EmptyStateMessage;


import React from "react";
import { Text } from "@/components/atoms/Typography";
import { Button } from "@/components/ui/button";
import { UserCheck, X } from "lucide-react";
import Card, { CardHeader, CardTitle, CardFooter } from "@/components/molecules/Card";
import { Ami } from "@/services/amiService";

interface AmiCardProps {
  ami: Ami;
  onRetirer: (id: number) => Promise<void>;
}

const AmiCard: React.FC<AmiCardProps> = ({ ami, onRetirer }) => {
  return (
    <Card hoverable>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
            <UserCheck size={20} />
          </div>
          <CardTitle>Ami</CardTitle>
        </div>
        <Text className="mt-2">
          Vous êtes amis depuis le {new Date(ami.created_at).toLocaleDateString()}.
        </Text>
      </CardHeader>
      <CardFooter className="flex justify-end">
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => onRetirer(ami.id)}
        >
          <X className="mr-1 h-4 w-4" />
          Retirer
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AmiCard;

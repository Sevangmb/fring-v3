
import React from 'react';
import { Button } from '@/components/ui/button';
import { User, Users } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

export interface Owner {
  id: string;
  name: string;
}

interface OwnerSelectorProps {
  owners: Owner[];
  selectedOwnerId: string;
  onChange: (ownerId: string) => void;
}

const OwnerSelector: React.FC<OwnerSelectorProps> = ({
  owners,
  selectedOwnerId,
  onChange
}) => {
  return (
    <ScrollArea className="w-full max-w-full">
      <div className="flex space-x-1 pb-2">
        {owners.map((owner) => (
          <Button
            key={owner.id}
            variant={selectedOwnerId === owner.id ? "default" : "outline"}
            size="sm"
            className={cn(
              "h-8 rounded-full flex items-center gap-1.5 px-3",
              selectedOwnerId === owner.id && "bg-primary text-primary-foreground"
            )}
            onClick={() => onChange(owner.id)}
          >
            {owner.id === 'me' ? (
              <User className="h-3 w-3" />
            ) : (
              <Users className="h-3 w-3" />
            )}
            {owner.name}
          </Button>
        ))}
      </div>
    </ScrollArea>
  );
};

export default OwnerSelector;

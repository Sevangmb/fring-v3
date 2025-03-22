
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/atoms/Typography";
import { List, Users } from "lucide-react";
import { Ami } from "@/services/amis/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MesEnsemblesTabProps {
  acceptedFriends?: Ami[];
}

const MesEnsemblesTab: React.FC<MesEnsemblesTabProps> = ({ acceptedFriends = [] }) => {
  const [selectedFriend, setSelectedFriend] = React.useState<string>("all");

  const handleFriendChange = (value: string) => {
    setSelectedFriend(value);
  };

  return (
    <TabsContent value="mes-ensembles">
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Ensembles Amis</CardTitle>
              <CardDescription>Consultez les ensembles de vêtements de vos amis.</CardDescription>
            </div>
            {acceptedFriends.length > 0 && (
              <div className="mt-2 md:mt-0 w-full md:w-64">
                <Select value={selectedFriend} onValueChange={handleFriendChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un ami" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les amis</SelectItem>
                    {acceptedFriends.map((ami) => (
                      <SelectItem 
                        key={ami.user_id === ami.ami_id ? ami.ami_id : ami.user_id} 
                        value={ami.user_id === ami.ami_id ? ami.ami_id : ami.user_id}
                      >
                        {ami.email || "Ami sans email"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Users size={64} className="text-muted-foreground mb-4" />
          <Text className="text-center">
            La fonctionnalité de visualisation des ensembles de vos amis est en cours de développement.
          </Text>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default MesEnsemblesTab;


import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Bell, MessageSquare, UserPlus, Award, ShoppingBag } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/atoms/Typography";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface NotificationOption {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  defaultValue: boolean;
}

const notificationOptions: NotificationOption[] = [
  {
    id: "new-friend",
    label: "Nouvelles demandes d'amis",
    description: "Quand quelqu'un vous envoie une demande d'ami",
    icon: <UserPlus size={16} />,
    defaultValue: true
  },
  {
    id: "new-message",
    label: "Nouveaux messages",
    description: "Quand vous recevez un nouveau message",
    icon: <MessageSquare size={16} />,
    defaultValue: true
  },
  {
    id: "defi-results",
    label: "Résultats des défis",
    description: "Quand un défi auquel vous participez est terminé",
    icon: <Award size={16} />,
    defaultValue: true
  },
  {
    id: "friend-activity",
    label: "Activité des amis",
    description: "Quand vos amis ajoutent de nouveaux vêtements ou ensembles",
    icon: <ShoppingBag size={16} />,
    defaultValue: false
  }
];

const NotificationSettings: React.FC = () => {
  const [settings, setSettings] = useState<Record<string, boolean>>(
    notificationOptions.reduce((acc, option) => ({
      ...acc,
      [option.id]: option.defaultValue
    }), {})
  );
  
  const [isSaving, setIsSaving] = useState(false);

  const handleToggle = (id: string) => {
    setSettings(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleSave = () => {
    setIsSaving(true);
    
    // Simulation d'une sauvegarde
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
    
    // Ici, on pourrait appeler une API pour sauvegarder les préférences de notification
    console.log("Saving notification settings:", settings);
  };

  return (
    <Card className="border border-primary/10 shadow-sm animate-slide-up bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-montserrat flex items-center gap-2">
          <Bell size={16} className="text-primary" />
          Notifications
        </CardTitle>
        <CardDescription className="font-montserrat">
          Gérez vos préférences de notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {notificationOptions.map((option) => (
          <div key={option.id} className="flex items-start justify-between py-2">
            <div className="flex gap-3">
              <div className="mt-0.5 text-muted-foreground">
                {option.icon}
              </div>
              <div>
                <Label htmlFor={option.id} className="font-montserrat">
                  {option.label}
                </Label>
                <Text variant="small" className="text-muted-foreground font-montserrat">
                  {option.description}
                </Text>
              </div>
            </div>
            <Switch
              id={option.id}
              checked={settings[option.id]}
              onCheckedChange={() => handleToggle(option.id)}
            />
          </div>
        ))}
        
        <Separator className="my-4" />
        
        <div className="flex justify-end">
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="font-montserrat"
          >
            {isSaving ? "Enregistrement..." : "Enregistrer les préférences"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;

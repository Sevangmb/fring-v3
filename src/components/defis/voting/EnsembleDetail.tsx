
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistance } from "date-fns";
import { fr } from "date-fns/locale";

interface EnsembleDetailProps {
  ensemble: any;
}

const EnsembleDetail: React.FC<EnsembleDetailProps> = ({ ensemble }) => {
  if (!ensemble) return null;
  
  const createdAt = ensemble.created_at ? new Date(ensemble.created_at) : new Date();
  const timeAgo = formatDistance(createdAt, new Date(), { addSuffix: true, locale: fr });
  
  // Organise les vêtements par catégorie pour l'affichage
  const vetements = ensemble.vetements || [];
  
  return (
    <div className="space-y-4">
      {ensemble.description && (
        <p className="text-sm text-muted-foreground">{ensemble.description}</p>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {vetements.map((item: any) => (
          <Card key={item.id} className="overflow-hidden">
            <CardContent className="p-2">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 rounded-md">
                  <AvatarImage 
                    src={item.vetement?.image_url} 
                    alt={item.vetement?.nom || "Vêtement"} 
                  />
                  <AvatarFallback className="rounded-md">
                    {item.vetement?.nom?.charAt(0) || "V"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="text-sm font-medium">{item.vetement?.nom}</h4>
                  <p className="text-xs text-muted-foreground">
                    {item.vetement?.marque}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="text-xs text-muted-foreground text-right">
        Publié {timeAgo}
      </div>
    </div>
  );
};

export default EnsembleDetail;

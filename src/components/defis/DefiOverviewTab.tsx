
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/atoms/Typography";
import DefiParticipationForm from "@/components/organisms/DefiParticipationForm";

interface DefiOverviewTabProps {
  defi: any;
  defiStatus: string | null;
  onParticipationUpdated: () => Promise<void>;
}

const DefiOverviewTab: React.FC<DefiOverviewTabProps> = ({ 
  defi, 
  defiStatus,
  onParticipationUpdated 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>À propos de ce défi</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Description</h3>
            <Text className="whitespace-pre-line">{defi.description}</Text>
          </div>
          
          <div>
            <h3 className="text-lg font-medium">Comment participer</h3>
            <Text>
              Pour participer à ce défi, choisissez un de vos ensembles ou créez-en un nouveau.
              Vous pouvez modifier votre participation à tout moment avant la fin du défi.
            </Text>
          </div>
          
          {defiStatus === "current" && (
            <DefiParticipationForm 
              defiId={defi.id} 
              onParticipationUpdated={onParticipationUpdated}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DefiOverviewTab;

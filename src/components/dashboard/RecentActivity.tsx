
import React from "react";
import Card, { CardHeader, CardTitle, CardDescription } from "@/components/molecules/Card";
import { CardContent } from "@/components/ui/card";
import { Text } from "@/components/atoms/Typography";

interface ActivityItem {
  type: string;
  date: string;
  description: string;
}

interface RecentActivityProps {
  activities: ActivityItem[];
}

const RecentActivity = ({ activities }: RecentActivityProps) => {
  if (activities.length === 0) return null;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activité récente</CardTitle>
        <CardDescription>Vos derniers ajouts de vêtements</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex justify-between border-b pb-3 last:border-0">
              <div>
                <Text weight="medium">{activity.description}</Text>
                <Text variant="small" className="text-muted-foreground">
                  {new Date(activity.date).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </Text>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;

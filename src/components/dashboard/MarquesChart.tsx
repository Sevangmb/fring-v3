
import React from "react";
import Card, { CardHeader, CardTitle, CardDescription } from "@/components/molecules/Card";
import { CardContent } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

interface MarquesChartProps {
  marquesDistribution: Array<{ name: string; count: number }>;
}

const MarquesChart = ({ marquesDistribution }: MarquesChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribution par marque</CardTitle>
        <CardDescription>Répartition de vos vêtements par marque</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="h-64 w-full">
          {marquesDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={marquesDistribution}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" />
                <Tooltip />
                <Bar dataKey="count" name="Nombre" fill="#D946EF" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              Aucune donnée disponible
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MarquesChart;

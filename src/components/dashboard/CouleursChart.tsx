
import React from "react";
import Card, { CardHeader, CardTitle, CardDescription } from "@/components/molecules/Card";
import { CardContent } from "@/components/ui/card";
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

interface CouleursChartProps {
  couleursDistribution: Array<{ name: string; count: number }>;
}

const CouleursChart = ({ couleursDistribution }: CouleursChartProps) => {
  // Couleurs pour les graphiques
  const COLORS = ['#8B5CF6', '#D946EF', '#F97316', '#0EA5E9', '#10B981', '#F59E0B'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribution par couleur</CardTitle>
        <CardDescription>Répartition de vos vêtements par couleur</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="h-64 w-full">
          {couleursDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={couleursDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {couleursDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} vêtements`, 'Quantité']} />
              </PieChart>
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

export default CouleursChart;

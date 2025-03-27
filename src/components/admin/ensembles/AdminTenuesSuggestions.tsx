
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Settings, Temperature, CloudRain } from 'lucide-react';

const AdminTenuesSuggestions: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tenues suggérées</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="logique">
          <TabsList className="mb-6">
            <TabsTrigger value="logique">Logique de suggestion</TabsTrigger>
            <TabsTrigger value="parametres">Paramètres météo</TabsTrigger>
          </TabsList>
          
          <TabsContent value="logique">
            <div className="space-y-4">
              <div className="p-6 border rounded-lg bg-muted/20">
                <h3 className="text-lg font-medium mb-2">Configuration de la logique de suggestion</h3>
                <p className="text-muted-foreground mb-4">
                  Personnalisez comment les vêtements sont sélectionnés en fonction des conditions météorologiques et des préférences utilisateur.
                </p>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="border rounded-md p-4 bg-card">
                    <div className="flex items-center gap-2 mb-2">
                      <Temperature className="h-5 w-5 text-amber-500" />
                      <h4 className="font-medium">Règles de température</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Définir les seuils de température et les types de vêtements associés.
                    </p>
                    <Button variant="outline" size="sm">Configurer</Button>
                  </div>
                  
                  <div className="border rounded-md p-4 bg-card">
                    <div className="flex items-center gap-2 mb-2">
                      <CloudRain className="h-5 w-5 text-blue-500" />
                      <h4 className="font-medium">Conditions de pluie</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Personnaliser les suggestions pour les jours de pluie.
                    </p>
                    <Button variant="outline" size="sm">Configurer</Button>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button className="gap-2">
                  <Settings className="h-4 w-4" />
                  Sauvegarder la configuration
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="parametres">
            <div className="space-y-4">
              <div className="p-6 border rounded-lg bg-muted/20">
                <h3 className="text-lg font-medium mb-2">Paramètres des données météo</h3>
                <p className="text-muted-foreground mb-4">
                  Configurez les sources de données météorologiques et les préférences d'affichage.
                </p>
                
                <div className="grid gap-4">
                  <div className="border rounded-md p-4 bg-card">
                    <h4 className="font-medium mb-2">Source de données</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      API météo actuelle: <span className="font-mono bg-muted p-1 rounded">OpenWeatherMap</span>
                    </p>
                    <Button variant="outline" size="sm">Changer de source</Button>
                  </div>
                  
                  <div className="border rounded-md p-4 bg-card">
                    <h4 className="font-medium mb-2">Fréquence de mise à jour</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Les données météo sont actualisées toutes les 3 heures.
                    </p>
                    <Button variant="outline" size="sm">Modifier</Button>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button className="gap-2">
                  <Settings className="h-4 w-4" />
                  Sauvegarder les paramètres
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdminTenuesSuggestions;


import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { UserCog, Users, Settings } from 'lucide-react';

const AdminRecommandations: React.FC = () => {
  const [algorithmeActif, setAlgorithmeActif] = useState(true);
  const [poidsPopularite, setPoidsPopularite] = useState([50]); // Pondération 50%
  const [poidsSimilarite, setPoidsSimilarite] = useState([30]); // Pondération 30%

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommandations</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="algorithme">
          <TabsList className="mb-6">
            <TabsTrigger value="algorithme">Algorithme</TabsTrigger>
            <TabsTrigger value="statistiques">Statistiques</TabsTrigger>
          </TabsList>
          
          <TabsContent value="algorithme">
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="algo-active" 
                    checked={algorithmeActif}
                    onCheckedChange={setAlgorithmeActif}
                  />
                  <Label htmlFor="algo-active" className="text-base cursor-pointer">
                    Moteur de recommandation actif
                  </Label>
                </div>
                <Button variant="outline" size="sm" disabled={!algorithmeActif}>
                  Recalculer les recommandations
                </Button>
              </div>
              
              <div className="space-y-6 p-4 border rounded-lg">
                <h3 className="text-lg font-medium">Paramètres du moteur de recommandation</h3>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="popularite">Poids de la popularité: {poidsPopularite}%</Label>
                    </div>
                    <Slider 
                      id="popularite"
                      value={poidsPopularite} 
                      onValueChange={setPoidsPopularite} 
                      min={0} 
                      max={100} 
                      step={1}
                      disabled={!algorithmeActif}
                    />
                    <p className="text-sm text-muted-foreground">
                      Influence des vêtements et ensembles populaires dans les recommandations.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="similarite">Poids de la similarité: {poidsSimilarite}%</Label>
                    </div>
                    <Slider 
                      id="similarite"
                      value={poidsSimilarite} 
                      onValueChange={setPoidsSimilarite} 
                      min={0} 
                      max={100} 
                      step={1}
                      disabled={!algorithmeActif}
                    />
                    <p className="text-sm text-muted-foreground">
                      Influence des préférences similaires entre utilisateurs.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Poids contextuel: {100 - poidsPopularite[0] - poidsSimilarite[0]}%</Label>
                    </div>
                    <div className="h-5 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary" 
                        style={{ width: `${100 - poidsPopularite[0] - poidsSimilarite[0]}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Influence de la météo, de la saison et d'autres facteurs contextuels.
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-end pt-4">
                  <Button className="gap-2" disabled={!algorithmeActif}>
                    <Settings className="h-4 w-4" />
                    Enregistrer les paramètres
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="statistiques">
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Taux d'engagement
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">78%</div>
                    <p className="text-xs text-muted-foreground">
                      Pourcentage d'utilisateurs qui suivent les recommandations
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <UserCog className="h-4 w-4" />
                      Précision
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">85%</div>
                    <p className="text-xs text-muted-foreground">
                      Pourcentage de recommandations jugées pertinentes
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Recommandations les plus suivies</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Nom</TableHead>
                        <TableHead>Nombre d'utilisations</TableHead>
                        <TableHead>Taux de satisfaction</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Ensemble</TableCell>
                        <TableCell>Tenue décontractée automne</TableCell>
                        <TableCell>324</TableCell>
                        <TableCell>92%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Météo</TableCell>
                        <TableCell>Suggestion temps pluvieux</TableCell>
                        <TableCell>287</TableCell>
                        <TableCell>89%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Ensemble</TableCell>
                        <TableCell>Look business casual</TableCell>
                        <TableCell>256</TableCell>
                        <TableCell>86%</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdminRecommandations;

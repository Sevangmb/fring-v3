
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/templates/Layout";
import { Helmet } from "react-helmet";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { fetchEnsembles, updateEnsemble } from "@/services/ensembleService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft } from "lucide-react";
import { Ensemble } from "@/services/ensembleService";
import { VetementType } from "@/services/meteo/tenue";
import EnsembleCreator from "@/components/ensembles/EnsembleCreator";
import { useEnsembleVetements } from "@/hooks/ensembles/useEnsembleVetements";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Vetement } from "@/services/vetement/types";

const ModifierEnsemble = () => {
  const { id } = useParams<{ id: string }>();
  const ensembleId = parseInt(id || "0");
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { allVetements, loading: loadingVetements } = useEnsembleVetements();
  
  const [ensemble, setEnsemble] = useState<Ensemble | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");
  const [occasion, setOccasion] = useState("");
  const [saison, setSaison] = useState("");
  const [selectedItems, setSelectedItems] = useState<{
    haut: Vetement | null;
    bas: Vetement | null;
    chaussures: Vetement | null;
  }>({
    haut: null,
    bas: null,
    chaussures: null
  });

  // Charger l'ensemble
  useEffect(() => {
    const loadEnsemble = async () => {
      if (!ensembleId) return;
      
      try {
        setLoading(true);
        const ensembles = await fetchEnsembles();
        const found = ensembles.find(e => e.id === ensembleId);
        
        if (!found) {
          toast({
            title: "Erreur",
            description: "Ensemble introuvable",
            variant: "destructive"
          });
          navigate("/ensembles");
          return;
        }
        
        setEnsemble(found);
        setNom(found.nom);
        setDescription(found.description || "");
        setOccasion(found.occasion || "");
        setSaison(found.saison || "");
      } catch (error) {
        console.error("Erreur lors du chargement de l'ensemble:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger l'ensemble",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadEnsemble();
  }, [ensembleId, navigate, toast]);

  // Initialiser les vêtements sélectionnés une fois que les données sont chargées
  useEffect(() => {
    if (ensemble && allVetements.length > 0) {
      const hautVetement = ensemble.vetements.find(v => 
        determineVetementType(v.vetement) === VetementType.HAUT
      )?.vetement || null;
      
      const basVetement = ensemble.vetements.find(v => 
        determineVetementType(v.vetement) === VetementType.BAS
      )?.vetement || null;
      
      const chaussuresVetement = ensemble.vetements.find(v => 
        determineVetementType(v.vetement) === VetementType.CHAUSSURES
      )?.vetement || null;
      
      setSelectedItems({
        haut: hautVetement,
        bas: basVetement,
        chaussures: chaussuresVetement
      });
    }
  }, [ensemble, allVetements]);

  const determineVetementType = (vetement: any): string => {
    const nomLower = vetement.nom ? vetement.nom.toLowerCase() : '';
    const descriptionLower = vetement.description ? vetement.description.toLowerCase() : '';
    const textToCheck = nomLower + ' ' + descriptionLower;
    
    const VETEMENTS_HAUTS = [
      'tshirt', 't-shirt', 'chemise', 'pull', 'sweat', 'sweatshirt', 'veste', 
      'manteau', 'blouson', 'gilet', 'hoodie', 'débardeur', 'top', 'polo'
    ];
    
    const VETEMENTS_BAS = [
      'pantalon', 'jean', 'short', 'jupe', 'bermuda', 'jogging', 'legging'
    ];
    
    const VETEMENTS_CHAUSSURES = [
      'chaussures', 'basket', 'baskets', 'tennis', 'bottes', 'bottines', 
      'mocassins', 'sandales', 'tongs', 'escarpins', 'derbies'
    ];
    
    if (VETEMENTS_HAUTS.some(h => textToCheck.includes(h))) return VetementType.HAUT;
    if (VETEMENTS_BAS.some(b => textToCheck.includes(b))) return VetementType.BAS;
    if (VETEMENTS_CHAUSSURES.some(c => textToCheck.includes(c))) return VetementType.CHAUSSURES;
    
    return 'autre';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedItems.haut || !selectedItems.bas || !selectedItems.chaussures) {
      toast({
        title: "Sélection incomplète",
        description: "Veuillez sélectionner un haut, un bas et des chaussures pour cet ensemble.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setSaving(true);
      
      await updateEnsemble({
        id: ensembleId,
        nom,
        description,
        occasion,
        saison,
        vetements: [
          {
            id: selectedItems.haut.id,
            type: VetementType.HAUT
          },
          {
            id: selectedItems.bas.id,
            type: VetementType.BAS
          },
          {
            id: selectedItems.chaussures.id,
            type: VetementType.CHAUSSURES
          }
        ]
      });
      
      toast({
        title: "Succès",
        description: "L'ensemble a été modifié avec succès"
      });
      
      navigate("/ensembles");
    } catch (error) {
      console.error("Erreur lors de la modification de l'ensemble:", error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier l'ensemble",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading || loadingVetements) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-64 w-full" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Helmet>
        <title>Modifier un ensemble | Garde-Robe</title>
        <meta name="description" content="Modifier un ensemble de vêtements" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-3xl mx-auto">
          <Button 
            variant="ghost" 
            className="mb-4"
            onClick={() => navigate("/ensembles")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux ensembles
          </Button>
          
          <Card>
            <CardHeader>
              <CardTitle>Modifier l'ensemble</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="nom">Nom de l'ensemble</Label>
                    <Input 
                      id="nom" 
                      value={nom} 
                      onChange={e => setNom(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description" 
                      value={description} 
                      onChange={e => setDescription(e.target.value)}
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="occasion">Occasion</Label>
                      <Select value={occasion} onValueChange={setOccasion}>
                        <SelectTrigger id="occasion">
                          <SelectValue placeholder="Choisir une occasion" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Aucune</SelectItem>
                          <SelectItem value="Casual">Casual</SelectItem>
                          <SelectItem value="Sport">Sport</SelectItem>
                          <SelectItem value="Formel">Formel</SelectItem>
                          <SelectItem value="Soirée">Soirée</SelectItem>
                          <SelectItem value="Travail">Travail</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="saison">Saison</Label>
                      <Select value={saison} onValueChange={setSaison}>
                        <SelectTrigger id="saison">
                          <SelectValue placeholder="Choisir une saison" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Aucune</SelectItem>
                          <SelectItem value="Printemps">Printemps</SelectItem>
                          <SelectItem value="Été">Été</SelectItem>
                          <SelectItem value="Automne">Automne</SelectItem>
                          <SelectItem value="Hiver">Hiver</SelectItem>
                          <SelectItem value="Toutes saisons">Toutes saisons</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Sélectionner les vêtements</h3>
                  <div className="border rounded-md p-4">
                    <EnsembleCreator 
                      vetements={allVetements}
                      selectedItems={selectedItems}
                      onItemsSelected={setSelectedItems}
                      showOwner={true}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end pt-4">
                  <Button 
                    type="submit" 
                    disabled={saving || !nom || !selectedItems.haut || !selectedItems.bas || !selectedItems.chaussures}
                    className="min-w-32"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Enregistrement...
                      </>
                    ) : "Enregistrer"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ModifierEnsemble;

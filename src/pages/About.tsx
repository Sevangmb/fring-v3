
import React, { useState } from "react";
import Layout from "@/components/templates/Layout";
import { Heading, Text } from "@/components/atoms/Typography";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, BookOpen, Calendar, ChevronRight, Clock, Flag, Newspaper, Plus, Trophy } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/atoms/Input";
import { useForm } from "react-hook-form";
import { toast } from "@/components/ui/use-toast";

// Type pour le formulaire de création de défi
type DefiFormValues = {
  titre: string;
  description: string;
  dateDebut: string;
  dateFin: string;
};

const AboutPage = () => {
  const [defisTab, setDefisTab] = useState("en-cours");
  
  // Configuration du formulaire pour créer un défi
  const form = useForm<DefiFormValues>({
    defaultValues: {
      titre: "",
      description: "",
      dateDebut: "",
      dateFin: ""
    }
  });
  
  const onSubmit = (data: DefiFormValues) => {
    console.log("Formulaire soumis:", data);
    toast({
      title: "Défi créé",
      description: "Votre défi a été créé avec succès.",
    });
    // Réinitialiser le formulaire
    form.reset();
  };

  return (
    <Layout>
      <div className="pt-24 pb-6 bg-accent/10">
        <div className="container mx-auto px-4">
          <Heading className="text-center">Fring</Heading>
          <Text className="text-center text-muted-foreground max-w-2xl mx-auto mt-4">
            Découvrez nos défis et les dernières nouvelles
          </Text>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="defis" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="defis" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              <span>Défis</span>
            </TabsTrigger>
            <TabsTrigger value="nouvelles" className="flex items-center gap-2">
              <Newspaper className="h-4 w-4" />
              <span>Nouvelles</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="defis" className="space-y-6 animate-fade-in">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Trophy className="h-6 w-6 text-primary" />
                    <Heading as="h2" variant="h3">Défis</Heading>
                  </div>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Créer un défi
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Créer un nouveau défi</DialogTitle>
                        <DialogDescription>
                          Remplissez le formulaire ci-dessous pour créer un nouveau défi pour la communauté.
                        </DialogDescription>
                      </DialogHeader>
                      
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                          <FormField
                            control={form.control}
                            name="titre"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Titre du défi</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="Entrez un titre accrocheur" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="Décrivez votre défi" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="dateDebut"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Date de début</FormLabel>
                                  <FormControl>
                                    <Input type="date" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="dateFin"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Date de fin</FormLabel>
                                  <FormControl>
                                    <Input type="date" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <DialogFooter>
                            <Button type="submit">Créer le défi</Button>
                          </DialogFooter>
                        </form>
                      </Form>
                      
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              
              <CardContent className="p-6 pt-0">
                <Tabs value={defisTab} onValueChange={setDefisTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-6">
                    <TabsTrigger value="en-cours" className="flex items-center gap-2">
                      <Flag className="h-4 w-4" />
                      <span>En cours</span>
                    </TabsTrigger>
                    <TabsTrigger value="a-venir" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>À venir</span>
                    </TabsTrigger>
                    <TabsTrigger value="passes" className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>Passés</span>
                    </TabsTrigger>
                  </TabsList>
                  
                  {/* Défis en cours */}
                  <TabsContent value="en-cours" className="space-y-4">
                    <Card className="overflow-hidden hover:shadow-md transition-all duration-300">
                      <CardHeader className="bg-primary/10 p-4 border-b flex items-center gap-2">
                        <Flag className="h-5 w-5 text-primary" />
                        <CardTitle className="text-lg">Défi hebdomadaire</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        <Text>Créez un ensemble avec au moins un vêtement partagé par un ami.</Text>
                        <div className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>15 juin - 22 juin 2024</span>
                        </div>
                      </CardContent>
                      <CardFooter className="border-t p-3 bg-muted/20">
                        <Button variant="outline" size="sm" className="ml-auto flex items-center gap-1">
                          Participer <ChevronRight className="h-3 w-3" />
                        </Button>
                      </CardFooter>
                    </Card>
                    
                    <Card className="overflow-hidden hover:shadow-md transition-all duration-300">
                      <CardHeader className="bg-primary/10 p-4 border-b flex items-center gap-2">
                        <Award className="h-5 w-5 text-primary" />
                        <CardTitle className="text-lg">Défi mensuel</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        <Text>Partagez 5 vêtements et créez un ensemble complet pour chaque type de météo.</Text>
                        <div className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>1 juin - 30 juin 2024</span>
                        </div>
                      </CardContent>
                      <CardFooter className="border-t p-3 bg-muted/20">
                        <Button variant="outline" size="sm" className="ml-auto flex items-center gap-1">
                          Participer <ChevronRight className="h-3 w-3" />
                        </Button>
                      </CardFooter>
                    </Card>
                  </TabsContent>
                  
                  {/* Défis à venir */}
                  <TabsContent value="a-venir" className="space-y-4">
                    <Card className="overflow-hidden hover:shadow-md transition-all duration-300">
                      <CardHeader className="bg-secondary/10 p-4 border-b flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-secondary" />
                        <CardTitle className="text-lg">Défi de la saison</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        <Text>Créez votre meilleur ensemble d'été et partagez-le avec la communauté.</Text>
                        <div className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>1 juillet - 31 août 2024</span>
                        </div>
                      </CardContent>
                      <CardFooter className="border-t p-3 bg-muted/20">
                        <Button variant="outline" size="sm" className="ml-auto flex items-center gap-1 opacity-70" disabled>
                          Bientôt disponible <Calendar className="h-3 w-3" />
                        </Button>
                      </CardFooter>
                    </Card>
                    
                    <Card className="overflow-hidden hover:shadow-md transition-all duration-300">
                      <CardHeader className="bg-secondary/10 p-4 border-b flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-secondary" />
                        <CardTitle className="text-lg">Challenge minimaliste</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        <Text>Créez 10 ensembles différents en utilisant un maximum de 15 vêtements.</Text>
                        <div className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>15 juillet - 15 août 2024</span>
                        </div>
                      </CardContent>
                      <CardFooter className="border-t p-3 bg-muted/20">
                        <Button variant="outline" size="sm" className="ml-auto flex items-center gap-1 opacity-70" disabled>
                          Bientôt disponible <Calendar className="h-3 w-3" />
                        </Button>
                      </CardFooter>
                    </Card>
                  </TabsContent>
                  
                  {/* Défis passés */}
                  <TabsContent value="passes" className="space-y-4">
                    <Card className="overflow-hidden hover:shadow-md transition-all duration-300 opacity-80">
                      <CardHeader className="bg-muted p-4 border-b flex items-center gap-2">
                        <Flag className="h-5 w-5" />
                        <CardTitle className="text-lg">Challenge des tendances</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        <Text>Créer un ensemble qui intègre au moins une tendance mode du printemps 2024.</Text>
                        <div className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>1 avril - 30 avril 2024</span>
                        </div>
                      </CardContent>
                      <CardFooter className="border-t p-3 bg-muted/20">
                        <Text className="text-sm text-muted-foreground">
                          <Award className="h-4 w-4 inline mr-1" />
                          158 participants
                        </Text>
                        <Button variant="outline" size="sm" className="ml-auto">
                          Voir les résultats
                        </Button>
                      </CardFooter>
                    </Card>
                    
                    <Card className="overflow-hidden hover:shadow-md transition-all duration-300 opacity-80">
                      <CardHeader className="bg-muted p-4 border-b flex items-center gap-2">
                        <Flag className="h-5 w-5" />
                        <CardTitle className="text-lg">Défi des couleurs</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        <Text>Créez des ensembles en utilisant uniquement des vêtements de trois couleurs maximum.</Text>
                        <div className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>1 mars - 31 mars 2024</span>
                        </div>
                      </CardContent>
                      <CardFooter className="border-t p-3 bg-muted/20">
                        <Text className="text-sm text-muted-foreground">
                          <Award className="h-4 w-4 inline mr-1" />
                          127 participants
                        </Text>
                        <Button variant="outline" size="sm" className="ml-auto">
                          Voir les résultats
                        </Button>
                      </CardFooter>
                    </Card>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="nouvelles" className="space-y-6 animate-fade-in">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <Newspaper className="h-6 w-6 text-primary" />
                  <Heading as="h2" variant="h3">Dernières nouvelles</Heading>
                </div>
                <div className="space-y-6">
                  <article className="border-b pb-4 animate-fade-in delay-100">
                    <Heading as="h3" variant="h4" className="mb-2">Mise à jour de l'interface utilisateur</Heading>
                    <Text className="text-sm text-muted-foreground mb-2">15 juin 2023</Text>
                    <Text>Nous avons amélioré l'interface utilisateur pour rendre l'application plus intuitive et agréable à utiliser. Découvrez les nouvelles animations et transitions fluides.</Text>
                  </article>
                  
                  <article className="border-b pb-4 animate-fade-in delay-200">
                    <Heading as="h3" variant="h4" className="mb-2">Nouvelles fonctionnalités de partage</Heading>
                    <Text className="text-sm text-muted-foreground mb-2">1 juin 2023</Text>
                    <Text>Partagez vos ensembles préférés directement sur les réseaux sociaux. Une nouvelle façon de montrer votre style à vos amis et votre famille.</Text>
                  </article>
                  
                  <article className="animate-fade-in delay-300">
                    <Heading as="h3" variant="h4" className="mb-2">Lancement de l'application</Heading>
                    <Text className="text-sm text-muted-foreground mb-2">15 mai 2023</Text>
                    <Text>Fring est maintenant disponible pour tous les utilisateurs. Commencez à organiser votre garde-robe et à partager vos vêtements avec vos amis dès aujourd'hui.</Text>
                  </article>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AboutPage;

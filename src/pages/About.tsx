
import React, { useState } from "react";
import Layout from "@/components/templates/Layout";
import { Heading, Text } from "@/components/atoms/Typography";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Award, BookOpen, Flag, Newspaper, Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const AboutPage = () => {
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
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <Trophy className="h-6 w-6 text-primary" />
                  <Heading as="h2" variant="h3">Défis en cours</Heading>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="overflow-hidden hover:shadow-md transition-all duration-300 animate-fade-in delay-100">
                    <div className="bg-primary/10 p-4 border-b flex items-center gap-2">
                      <Flag className="h-5 w-5 text-primary" />
                      <Heading as="h3" variant="h4">Défi hebdomadaire</Heading>
                    </div>
                    <CardContent className="p-4">
                      <Text>Créez un ensemble avec au moins un vêtement partagé par un ami.</Text>
                    </CardContent>
                  </Card>
                  
                  <Card className="overflow-hidden hover:shadow-md transition-all duration-300 animate-fade-in delay-200">
                    <div className="bg-primary/10 p-4 border-b flex items-center gap-2">
                      <Award className="h-5 w-5 text-primary" />
                      <Heading as="h3" variant="h4">Défi mensuel</Heading>
                    </div>
                    <CardContent className="p-4">
                      <Text>Partagez 5 vêtements et créez un ensemble complet pour chaque type de météo.</Text>
                    </CardContent>
                  </Card>
                  
                  <Card className="overflow-hidden hover:shadow-md transition-all duration-300 animate-fade-in delay-300">
                    <div className="bg-primary/10 p-4 border-b flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      <Heading as="h3" variant="h4">Défi communautaire</Heading>
                    </div>
                    <CardContent className="p-4">
                      <Text>Créez un ensemble inspiré par votre saison préférée et partagez-le avec 3 amis.</Text>
                    </CardContent>
                  </Card>
                </div>
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

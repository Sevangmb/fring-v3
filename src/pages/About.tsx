
import React from "react";
import Layout from "@/components/templates/Layout";
import { Heading, Text } from "@/components/atoms/Typography";
import { Info, User, Building, Award, Book } from "lucide-react";

const AboutPage = () => {
  return (
    <Layout>
      <div className="pt-24 pb-6 bg-accent/10">
        <div className="container mx-auto px-4">
          <Heading className="text-center">À Propos</Heading>
          <Text className="text-center text-muted-foreground max-w-2xl mx-auto mt-4">
            Découvrez notre histoire, notre mission et nos valeurs.
          </Text>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <Info className="h-6 w-6 text-primary" />
                <Heading as="h2" variant="h3">Notre Mission</Heading>
              </div>
              <Text>
                Notre application vise à simplifier la gestion de votre garde-robe et à faciliter le partage avec 
                vos amis. Nous croyons qu'une garde-robe bien organisée contribue à un mode de vie plus durable et conscient.
              </Text>
            </section>
            
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <Building className="h-6 w-6 text-primary" />
                <Heading as="h2" variant="h3">Notre Entreprise</Heading>
              </div>
              <Text>
                Fondée en 2023, notre entreprise s'engage à créer des solutions innovantes pour faciliter 
                la vie quotidienne. Basée en France, notre équipe travaille avec passion pour offrir la 
                meilleure expérience utilisateur possible.
              </Text>
            </section>
          </div>
          
          <div className="space-y-8">
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="h-6 w-6 text-primary" />
                <Heading as="h2" variant="h3">Notre Équipe</Heading>
              </div>
              <Text>
                Notre équipe est composée de designers, développeurs et experts en mode qui partagent 
                tous la même vision : vous aider à mieux organiser votre garde-robe et à partager 
                vos styles avec vos amis.
              </Text>
            </section>
            
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <Award className="h-6 w-6 text-primary" />
                <Heading as="h2" variant="h3">Nos Valeurs</Heading>
              </div>
              <Text>
                Nous croyons en la simplicité, la durabilité et le partage. Notre application 
                est conçue pour être intuitive et accessible à tous, tout en promouvant une 
                consommation plus responsable.
              </Text>
            </section>
            
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <Book className="h-6 w-6 text-primary" />
                <Heading as="h2" variant="h3">Notre Histoire</Heading>
              </div>
              <Text>
                L'idée de cette application est née d'un besoin personnel : mieux organiser sa garde-robe 
                et partager facilement ses vêtements préférés avec ses amis. Ce qui était au départ un 
                projet personnel est devenu une application complète que nous sommes fiers de partager 
                avec vous aujourd'hui.
              </Text>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;

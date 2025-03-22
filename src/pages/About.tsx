
import React from "react";
import Layout from "@/components/templates/Layout";
import { Heading, Text } from "@/components/atoms/Typography";
import { Info, User, Building, Award, Book, Sparkles } from "lucide-react";

const AboutPage = () => {
  return (
    <Layout>
      <div className="pt-24 pb-6 bg-accent/10">
        <div className="container mx-auto px-4">
          <Heading className="text-center">À Propos de Fring</Heading>
          <Text className="text-center text-muted-foreground max-w-2xl mx-auto mt-4">
            Découvrez notre histoire, notre mission et nos animations.
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
                Fring vise à simplifier la gestion de votre garde-robe et à faciliter le partage avec 
                vos amis. Nous croyons qu'une garde-robe bien organisée contribue à un mode de vie plus durable et conscient.
              </Text>
            </section>
            
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <Building className="h-6 w-6 text-primary" />
                <Heading as="h2" variant="h3">Notre Entreprise</Heading>
              </div>
              <Text>
                Fondée en 2023, Fring s'engage à créer des solutions innovantes pour faciliter 
                la vie quotidienne. Basée en France, notre équipe travaille avec passion pour offrir la 
                meilleure expérience utilisateur possible.
              </Text>
            </section>
            
            <section className="space-y-4 hover:scale-105 transition-all duration-300">
              <div className="flex items-center gap-3">
                <Sparkles className="h-6 w-6 text-primary animate-pulse" />
                <Heading as="h2" variant="h3">Nos Animations</Heading>
              </div>
              <Text>
                Fring utilise différentes animations pour améliorer votre expérience:
              </Text>
              <ul className="space-y-2 list-disc pl-5">
                <li className="animate-fade-in">Animations de fondu pour des transitions fluides</li>
                <li className="animate-slide-up delay-100">Animations de glissement pour les menus et listes</li>
                <li className="animate-slide-down delay-200">Effets de survol interactifs pour les cartes</li>
                <li className="animate-float">Effet flottant pour certains éléments</li>
              </ul>
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
                Nous croyons en la simplicité, la durabilité et le partage. Fring 
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
                L'idée de Fring est née d'un besoin personnel : mieux organiser sa garde-robe 
                et partager facilement ses vêtements préférés avec ses amis. Ce qui était au départ un 
                projet personnel est devenu une application complète que nous sommes fiers de partager 
                avec vous aujourd'hui.
              </Text>
            </section>
            
            <section className="space-y-4 card-theme p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-3">
                <Sparkles className="h-6 w-6 text-primary" />
                <Heading as="h2" variant="h3" className="story-link">Technologies d'Animation</Heading>
              </div>
              <Text>
                Fring utilise des technologies modernes pour ses animations:
              </Text>
              <div className="grid grid-cols-2 gap-3 mt-2">
                <div className="bg-primary/5 p-2 rounded animate-fade-in delay-100">Tailwind Animations</div>
                <div className="bg-primary/5 p-2 rounded animate-fade-in delay-200">CSS Transitions</div>
                <div className="bg-primary/5 p-2 rounded animate-fade-in delay-300">React Motion</div>
                <div className="bg-primary/5 p-2 rounded animate-fade-in delay-400">Effets Parallax</div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;

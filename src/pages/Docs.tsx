
import React from "react";
import Layout from "@/components/templates/Layout";
import PageHeader from "@/components/organisms/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Shirt, Users, Zap, MessageSquare, Search, FileText, Cloud } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Heading, Text } from "@/components/atoms/Typography";

interface DocCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
  delay?: number;
}

const DocCard: React.FC<DocCardProps> = ({
  title,
  description,
  icon,
  className,
  delay = 0
}) => {
  return (
    <Card 
      className={cn(
        "h-full animate-fade-in", 
        className
      )}
      style={{
        animationDelay: `${delay}ms`
      }}
    >
      <CardContent className="p-6">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
          {icon}
        </div>
        <Heading as="h3" className="text-xl font-semibold mb-2">{title}</Heading>
        <Text className="text-muted-foreground">{description}</Text>
      </CardContent>
    </Card>
  );
};

const Docs: React.FC = () => {
  const docSections = [
    {
      title: "Commencer avec Fring",
      description: "Guide d'introduction pour créer votre compte et configurer votre garde-robe virtuelle.",
      icon: <BookOpen size={24} />,
    },
    {
      title: "Gérer votre garde-robe",
      description: "Apprenez à ajouter, organiser et rechercher efficacement vos vêtements dans l'application.",
      icon: <Shirt size={24} />,
    },
    {
      title: "Créer des ensembles",
      description: "Guide complet pour assembler des tenues et les sauvegarder pour une utilisation ultérieure.",
      icon: <Zap size={24} />,
    },
    {
      title: "Fonctionnalités sociales",
      description: "Découvrez comment connecter avec vos amis et partager vos tenues préférées.",
      icon: <Users size={24} />,
    },
    {
      title: "Messagerie",
      description: "Guide d'utilisation du système de messagerie pour communiquer avec vos amis.",
      icon: <MessageSquare size={24} />,
    },
    {
      title: "Recherche avancée",
      description: "Astuces pour utiliser efficacement la recherche pour retrouver rapidement vos vêtements.",
      icon: <Search size={24} />,
    },
    {
      title: "API et intégrations",
      description: "Documentation technique pour les développeurs souhaitant intégrer Fring à leurs applications.",
      icon: <FileText size={24} />,
    },
    {
      title: "Services cloud",
      description: "Informations sur la sauvegarde, la synchronisation et les fonctionnalités cloud de Fring.",
      icon: <Cloud size={24} />,
    }
  ];

  return (
    <Layout>
      <PageHeader 
        title="Documentation" 
        description="Guides complets et ressources pour tirer le meilleur parti de Fring"
      />
      
      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="guides" className="w-full mb-8">
          <TabsList className="mb-6 mx-auto flex justify-center">
            <TabsTrigger value="guides">Guides d'utilisation</TabsTrigger>
            <TabsTrigger value="api">Documentation API</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>
          
          <TabsContent value="guides">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {docSections.slice(0, 6).map((section, index) => (
                <DocCard
                  key={index}
                  title={section.title}
                  description={section.description}
                  icon={section.icon}
                  delay={index * 100}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="api">
            <Card>
              <CardContent className="p-6">
                <Heading as="h2" className="text-2xl font-bold mb-4">Documentation API</Heading>
                <Text className="mb-6">
                  L'API Fring permet aux développeurs d'intégrer des fonctionnalités de gestion de garde-robe et de création d'ensembles dans leurs propres applications.
                </Text>
                
                <Heading as="h3" className="text-xl font-semibold mt-6 mb-3">Authentification</Heading>
                <Text className="mb-4">
                  L'API Fring utilise l'authentification OAuth 2.0. Pour obtenir une clé API, vous devez créer un compte développeur et configurer votre application dans le tableau de bord développeur.
                </Text>
                
                <Heading as="h3" className="text-xl font-semibold mt-6 mb-3">Points de terminaison</Heading>
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md mb-4">
                  <code className="text-sm">
                    GET /api/v1/vetements<br/>
                    GET /api/v1/ensembles<br/>
                    POST /api/v1/vetements<br/>
                    PUT /api/v1/vetements/:id<br/>
                    DELETE /api/v1/vetements/:id
                  </code>
                </div>
                
                <Text className="mb-4">
                  Consultez notre documentation complète de l'API pour plus de détails sur les paramètres, les codes de réponse et les exemples d'utilisation.
                </Text>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="faq">
            <Card>
              <CardContent className="p-6">
                <Heading as="h2" className="text-2xl font-bold mb-6">Questions fréquemment posées</Heading>
                
                <div className="space-y-6">
                  <div>
                    <Heading as="h3" className="text-lg font-semibold mb-2">Comment puis-je ajouter un vêtement à ma garde-robe ?</Heading>
                    <Text>
                      Pour ajouter un vêtement, rendez-vous dans la section "Mes Vêtements" et cliquez sur le bouton "+" en bas à droite de l'écran. Remplissez le formulaire avec les détails de votre vêtement et téléchargez une photo.
                    </Text>
                  </div>
                  
                  <div>
                    <Heading as="h3" className="text-lg font-semibold mb-2">Comment fonctionnent les suggestions météo ?</Heading>
                    <Text>
                      Fring utilise les données météorologiques de votre localisation actuelle pour suggérer des tenues adaptées aux conditions météorologiques. Assurez-vous d'avoir autorisé l'accès à votre localisation dans les paramètres de l'application.
                    </Text>
                  </div>
                  
                  <div>
                    <Heading as="h3" className="text-lg font-semibold mb-2">Puis-je partager mes ensembles avec mes amis ?</Heading>
                    <Text>
                      Oui, vous pouvez partager vos ensembles avec vos amis en cliquant sur le bouton de partage dans la vue détaillée de l'ensemble. Vous pouvez également contrôler qui peut voir vos ensembles dans les paramètres de confidentialité.
                    </Text>
                  </div>
                  
                  <div>
                    <Heading as="h3" className="text-lg font-semibold mb-2">Comment modifier mon profil ?</Heading>
                    <Text>
                      Pour modifier votre profil, accédez à la page "Profil" depuis le menu principal, puis cliquez sur "Modifier le profil". Vous pourrez y mettre à jour votre photo de profil, votre nom d'utilisateur et d'autres informations personnelles.
                    </Text>
                  </div>
                  
                  <div>
                    <Heading as="h3" className="text-lg font-semibold mb-2">Est-ce que mes données sont sécurisées ?</Heading>
                    <Text>
                      Oui, la sécurité de vos données est notre priorité. Toutes les données sont chiffrées et nous ne partageons jamais vos informations avec des tiers sans votre consentement explicite. Consultez notre politique de confidentialité pour plus d'informations.
                    </Text>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <Separator className="my-12" />
        
        <div className="text-center max-w-2xl mx-auto">
          <Heading as="h2" className="text-2xl font-bold mb-4">
            Besoin d'aide supplémentaire ?
          </Heading>
          <Text className="text-muted-foreground mb-6">
            Si vous ne trouvez pas la réponse à votre question, n'hésitez pas à contacter notre équipe de support.
          </Text>
          <div className="flex justify-center gap-4">
            <a 
              href="mailto:support@fring-app.com" 
              className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              Contacter le support
            </a>
            <a 
              href="/faq" 
              className="px-6 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
            >
              Consulter la FAQ
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Docs;


import React from "react";
import { Newspaper } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Heading, Text } from "@/components/atoms/Typography";

type NewsItem = {
  title: string;
  date: string;
  content: string;
  delay: string;
};

const NewsContent: React.FC = () => {
  const newsItems: NewsItem[] = [
    {
      title: "Mise à jour de l'interface utilisateur",
      date: "15 juin 2023",
      content: "Nous avons amélioré l'interface utilisateur pour rendre l'application plus intuitive et agréable à utiliser. Découvrez les nouvelles animations et transitions fluides.",
      delay: "delay-100"
    },
    {
      title: "Nouvelles fonctionnalités de partage",
      date: "1 juin 2023",
      content: "Partagez vos ensembles préférés directement sur les réseaux sociaux. Une nouvelle façon de montrer votre style à vos amis et votre famille.",
      delay: "delay-200"
    },
    {
      title: "Lancement de l'application",
      date: "15 mai 2023",
      content: "Fring est maintenant disponible pour tous les utilisateurs. Commencez à organiser votre garde-robe et à partager vos vêtements avec vos amis dès aujourd'hui.",
      delay: "delay-300"
    }
  ];

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <Newspaper className="h-6 w-6 text-primary" />
          <Heading as="h2" variant="h3">Dernières nouvelles</Heading>
        </div>
        <div className="space-y-6">
          {newsItems.map((item, index) => (
            <article key={index} className={`${index < newsItems.length - 1 ? "border-b pb-4" : ""} animate-fade-in ${item.delay}`}>
              <Heading as="h3" variant="h4" className="mb-2">{item.title}</Heading>
              <Text className="text-sm text-muted-foreground mb-2">{item.date}</Text>
              <Text>{item.content}</Text>
            </article>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default NewsContent;

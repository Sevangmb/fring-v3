
import React, { useEffect, useState } from "react";
import { Newspaper } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Heading, Text } from "@/components/atoms/Typography";
import { supabase } from "@/lib/supabase";
import { Skeleton } from "@/components/ui/skeleton";

type NewsItem = {
  id: number;
  title: string;
  date: string;
  content: string;
  created_at: string;
};

const NewsContent: React.FC = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('news')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        setNewsItems(data || []);
      } catch (error) {
        console.error('Erreur lors du chargement des actualités:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Newspaper className="h-6 w-6 text-primary" />
            <Heading as="h2" variant="h3">Dernières nouvelles</Heading>
          </div>
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className={index < 2 ? "border-b pb-4" : ""}>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/4 mb-2" />
                <Skeleton className="h-20 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // S'il n'y a pas d'actualités en base, afficher les données par défaut
  const defaultNewsItems: NewsItem[] = newsItems.length > 0 ? newsItems : [
    {
      id: 1,
      title: "Mise à jour de l'interface utilisateur",
      date: "15 juin 2023",
      content: "Nous avons amélioré l'interface utilisateur pour rendre l'application plus intuitive et agréable à utiliser. Découvrez les nouvelles animations et transitions fluides.",
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      title: "Nouvelles fonctionnalités de partage",
      date: "1 juin 2023",
      content: "Partagez vos ensembles préférés directement sur les réseaux sociaux. Une nouvelle façon de montrer votre style à vos amis et votre famille.",
      created_at: new Date().toISOString()
    },
    {
      id: 3,
      title: "Lancement de l'application",
      date: "15 mai 2023",
      content: "Fring est maintenant disponible pour tous les utilisateurs. Commencez à organiser votre garde-robe et à partager vos vêtements avec vos amis dès aujourd'hui.",
      created_at: new Date().toISOString()
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
          {defaultNewsItems.map((item, index) => (
            <article key={item.id} className={`${index < defaultNewsItems.length - 1 ? "border-b pb-4" : ""} animate-fade-in delay-${index * 100}`}>
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

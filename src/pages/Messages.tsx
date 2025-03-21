
import React from "react";
import Layout from "@/components/templates/Layout";
import { Helmet } from "react-helmet";
import { Heading, Text } from "@/components/atoms/Typography";
import MessagesPageContent from "@/components/templates/MessagesPageContent";
import { useParams } from "react-router-dom";
import { getUserIdByEmail } from "@/services/amis/userEmail";

const MessagesPage = () => {
  const { friendId } = useParams<{ friendId: string }>();
  
  return (
    <Layout>
      <Helmet>
        <title>Messages | Gestion des messages</title>
        <meta name="description" content="Consultez et échangez des messages avec vos amis" />
      </Helmet>
      
      <div className="pt-24 pb-6 bg-accent/10">
        <div className="container mx-auto px-4">
          <Heading className="text-center">Messages</Heading>
          <Text className="text-center text-muted-foreground max-w-2xl mx-auto mt-4">
            Consultez et échangez des messages avec vos amis.
          </Text>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <MessagesPageContent friendIdOrEmail={friendId} />
      </div>
    </Layout>
  );
};

export default MessagesPage;

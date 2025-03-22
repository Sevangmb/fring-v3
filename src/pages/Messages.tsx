
import React, { useEffect } from "react";
import Layout from "@/components/templates/Layout";
import { Helmet } from "react-helmet";
import { useAuth } from "@/contexts/AuthContext";
import AmisPageHeader from "@/components/organisms/AmisPageHeader";
import MessagesPageContent from "@/components/templates/MessagesPageContent";
import { useParams, useNavigate } from "react-router-dom";
import { getUserIdByEmail } from "@/services/amis/userEmail";

const MessagesPage = () => {
  const { friendId } = useParams<{ friendId: string }>();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  
  // Convertir l'ID en email si c'est un UUID
  useEffect(() => {
    if (friendId && friendId.includes("-")) {
      // Si l'ID ressemble à un UUID, rediriger vers la version avec email
      import("@/services/amis/userEmail").then(({ getUserEmailById }) => {
        getUserEmailById(friendId).then(email => {
          if (email) {
            navigate(`/messages/${email}`, { replace: true });
          }
        });
      });
    }
  }, [friendId, navigate]);
  
  return (
    <Layout>
      <Helmet>
        <title>Messages | Gestion des messages</title>
        <meta name="description" content="Consultez et échangez des messages avec vos amis" />
      </Helmet>
      
      <AmisPageHeader user={user} loading={loading} />
      
      <div className="container mx-auto px-4 py-8">
        <MessagesPageContent friendIdOrEmail={friendId} />
      </div>
    </Layout>
  );
};

export default MessagesPage;

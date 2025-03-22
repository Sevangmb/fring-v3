
import React from "react";
import Layout from "@/components/templates/Layout";
import { Heading } from "@/components/atoms/Typography";
import Card from "@/components/molecules/Card";
import { useNavigate } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import ProfileForm from "@/components/profile/ProfileForm";
import ProfileDetails from "@/components/profile/ProfileDetails";
import { useEffect } from "react";

const Profile = () => {
  const navigate = useNavigate();
  const {
    user,
    form,
    isEditing,
    isLoading,
    uploadingAvatar,
    avatarPreview,
    getUserInitials,
    formatJoinDate,
    toggleEdit,
    handleAvatarChange,
    onSubmit,
    handleLogout
  } = useProfile();

  // Rediriger vers la page d'accueil si l'utilisateur n'est pas connecté
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-3xl mx-auto">
          <Heading variant="h3" className="mb-6 font-montserrat">Mon profil</Heading>
          
          <Card className="p-8 shadow-md border border-primary/10 transition-all duration-300 hover:shadow-lg">
            {isEditing ? (
              <ProfileForm
                form={form}
                onSubmit={onSubmit}
                isLoading={isLoading}
                isUploading={uploadingAvatar}
                avatarPreview={avatarPreview}
                userEmail={user.email || ""}
                userInitials={getUserInitials()}
                onToggleEdit={toggleEdit}
                onAvatarChange={handleAvatarChange}
              />
            ) : (
              <ProfileDetails
                user={user}
                getUserInitials={getUserInitials}
                formatJoinDate={formatJoinDate}
                avatarUrl={user.user_metadata?.avatar_url}
                onLogout={handleLogout}
                onToggleEdit={toggleEdit}
              />
            )}
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;

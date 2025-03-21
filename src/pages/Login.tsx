
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import Layout from "@/components/templates/Layout";
import Card from "@/components/molecules/Card";
import { Heading, Text } from "@/components/atoms/Typography";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email) {
      newErrors.email = "Email requis";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Veuillez entrer un email valide";
    }
    
    if (!password) {
      newErrors.password = "Mot de passe requis";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      await signIn(email, password);
      // Rediriger vers la page de profil après connexion
      navigate("/profile");
    } catch (error) {
      console.error("Erreur de connexion:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout footer={false}>
      <div className="flex min-h-screen items-center justify-center p-4 bg-muted/30">
        <div className="w-full max-w-md animate-fade-in">
          <Card className="p-8">
            <div className="text-center mb-8">
              <Heading variant="h4" className="mb-2">Bienvenue</Heading>
              <Text variant="subtle">Connectez-vous à votre compte</Text>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-6">
              <Input
                label="Email"
                type="email"
                placeholder="nom@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                icon={<Mail size={18} />}
                required
              />
              
              <div>
                <Input
                  label="Mot de passe"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={errors.password}
                  icon={<Lock size={18} />}
                  required
                />
                
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? (
                        <span className="flex items-center">
                          <EyeOff size={14} className="mr-1" /> Masquer
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <Eye size={14} className="mr-1" /> Afficher
                        </span>
                      )}
                    </button>
                  </div>
                  
                  <Link
                    to="/forgot-password"
                    className="text-xs text-primary hover:underline"
                  >
                    Mot de passe oublié?
                  </Link>
                </div>
              </div>
              
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Connexion en cours..." : "Se connecter"}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <Text variant="small" className="text-muted-foreground">
                Vous n'avez pas de compte ?{" "}
                <Link to="/register" className="text-primary hover:underline">
                  S'inscrire
                </Link>
              </Text>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Login;

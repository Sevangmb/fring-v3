
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import Layout from "@/components/templates/Layout";
import Card from "@/components/molecules/Card";
import { Heading, Text } from "@/components/atoms/Typography";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import { useAuth } from "@/contexts/AuthContext";

const Register = () => {
  const { signUp } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});

  const validateForm = () => {
    const newErrors: {
      name?: string;
      email?: string;
      password?: string;
    } = {};
    
    if (!name) {
      newErrors.name = "Nom requis";
    }
    
    if (!email) {
      newErrors.email = "Email requis";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Veuillez entrer un email valide";
    }
    
    if (!password) {
      newErrors.password = "Mot de passe requis";
    } else if (password.length < 8) {
      newErrors.password = "Le mot de passe doit contenir au moins 8 caractères";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      await signUp(email, password, name);
    } catch (error) {
      console.error("Erreur d'inscription:", error);
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
              <Heading variant="h4" className="mb-2">Créer un compte</Heading>
              <Text variant="subtle">Inscrivez-vous pour commencer</Text>
            </div>
            
            <form onSubmit={handleRegister} className="space-y-6">
              <Input
                label="Nom complet"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={errors.name}
                icon={<User size={18} />}
                required
              />
              
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
                
                <div className="mt-2 flex items-center">
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
              </div>
              
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Création du compte..." : "Créer un compte"}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <Text variant="small" className="text-muted-foreground">
                Vous avez déjà un compte ?{" "}
                <Link to="/login" className="text-primary hover:underline">
                  Se connecter
                </Link>
              </Text>
              
              <Text variant="small" className="mt-4 text-muted-foreground">
                En créant un compte, vous acceptez nos{" "}
                <Link to="/terms" className="text-primary hover:underline">
                  Conditions d'utilisation
                </Link>{" "}
                et notre{" "}
                <Link to="/privacy" className="text-primary hover:underline">
                  Politique de confidentialité
                </Link>
              </Text>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Register;

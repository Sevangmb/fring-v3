
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import Layout from "@/components/templates/Layout";
import Card from "@/components/molecules/Card";
import { Heading, Text } from "@/components/atoms/Typography";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import { useToast } from "@/hooks/use-toast";

const Register = () => {
  const { toast } = useToast();
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
      newErrors.name = "Name is required";
    }
    
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Simulating API call
    setTimeout(() => {
      setIsLoading(false);
      
      // Temporary registration simulation
      toast({
        title: "Account created",
        description: "You have successfully registered an account",
      });
      
      // In a real app, redirect to login or dashboard after registration
      // navigate("/login");
    }, 1500);
  };

  return (
    <Layout footer={false}>
      <div className="flex min-h-screen items-center justify-center p-4 bg-muted/30">
        <div className="w-full max-w-md animate-fade-in">
          <Card className="p-8">
            <div className="text-center mb-8">
              <Heading variant="h4" className="mb-2">Create an account</Heading>
              <Text variant="subtle">Sign up to get started with our platform</Text>
            </div>
            
            <form onSubmit={handleRegister} className="space-y-6">
              <Input
                label="Full Name"
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
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                icon={<Mail size={18} />}
                required
              />
              
              <div>
                <Input
                  label="Password"
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
                        <EyeOff size={14} className="mr-1" /> Hide
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Eye size={14} className="mr-1" /> Show
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
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <Text variant="small" className="text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </Text>
              
              <Text variant="small" className="mt-4 text-muted-foreground">
                By creating an account, you agree to our{" "}
                <Link to="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-primary hover:underline">
                  Privacy Policy
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

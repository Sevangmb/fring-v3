import React from "react";
import { cn } from "@/lib/utils";
import { Heading, Text } from "../atoms/Typography";
import Button from "../atoms/Button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
interface HeroProps {
  className?: string;
}
const Hero = ({
  className
}: HeroProps) => {
  const navigate = useNavigate();
  const handleGetStarted = () => navigate("/register");
  const handleLearnMore = () => navigate("/features");
  return <section className={cn("relative overflow-hidden pt-20 md:pt-24 lg:pt-32", className)}>
      <div className="absolute inset-0 bg-gradient-to-b from-background to-background/80 -z-10"></div>
      
    </section>;
};
export default Hero;
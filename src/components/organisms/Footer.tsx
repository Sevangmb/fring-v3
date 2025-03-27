import React from "react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Text } from "../atoms/Typography";
import { Github, Twitter, Linkedin } from "lucide-react";
interface FooterProps {
  className?: string;
}
const Footer = ({
  className
}: FooterProps) => {
  const year = new Date().getFullYear();
  const footerLinks = [{
    title: "Product",
    links: [{
      label: "Features",
      href: "/features"
    }, {
      label: "Pricing",
      href: "/pricing"
    }, {
      label: "Roadmap",
      href: "/roadmap"
    }]
  }, {
    title: "Company",
    links: [{
      label: "About",
      href: "/about"
    }, {
      label: "Careers",
      href: "/careers"
    }, {
      label: "Blog",
      href: "/blog"
    }]
  }, {
    title: "Resources",
    links: [{
      label: "Documentation",
      href: "/docs"
    }, {
      label: "Support",
      href: "/support"
    }, {
      label: "Contact",
      href: "/contact"
    }]
  }, {
    title: "Legal",
    links: [{
      label: "Privacy",
      href: "/privacy"
    }, {
      label: "Terms",
      href: "/terms"
    }, {
      label: "Cookie Policy",
      href: "/cookies"
    }]
  }];
  const socialLinks = [{
    icon: <Github size={20} />,
    href: "https://github.com",
    label: "GitHub"
  }, {
    icon: <Twitter size={20} />,
    href: "https://twitter.com",
    label: "Twitter"
  }, {
    icon: <Linkedin size={20} />,
    href: "https://linkedin.com",
    label: "LinkedIn"
  }];
  return;
};
export default Footer;
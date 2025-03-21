
import React from "react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Text } from "../atoms/Typography";
import { Github, Twitter, Linkedin } from "lucide-react";

interface FooterProps {
  className?: string;
}

const Footer = ({ className }: FooterProps) => {
  const year = new Date().getFullYear();
  
  const footerLinks = [
    {
      title: "Product",
      links: [
        { label: "Features", href: "/features" },
        { label: "Pricing", href: "/pricing" },
        { label: "Roadmap", href: "/roadmap" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "/about" },
        { label: "Careers", href: "/careers" },
        { label: "Blog", href: "/blog" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Documentation", href: "/docs" },
        { label: "Support", href: "/support" },
        { label: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy", href: "/privacy" },
        { label: "Terms", href: "/terms" },
        { label: "Cookie Policy", href: "/cookies" },
      ],
    },
  ];

  const socialLinks = [
    { 
      icon: <Github size={20} />, 
      href: "https://github.com", 
      label: "GitHub" 
    },
    { 
      icon: <Twitter size={20} />, 
      href: "https://twitter.com", 
      label: "Twitter" 
    },
    { 
      icon: <Linkedin size={20} />, 
      href: "https://linkedin.com", 
      label: "LinkedIn" 
    },
  ];

  return (
    <footer className={cn("bg-muted/30 py-16", className)}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-12 border-b">
          <div className="col-span-2">
            <Link to="/" className="inline-block mb-6">
              <span className="text-xl font-bold">AppName</span>
            </Link>
            <Text className="text-muted-foreground mb-6 max-w-md">
              Modern application development platform that helps teams build better software faster.
            </Text>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 flex items-center justify-center rounded-md bg-background text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {footerLinks.map((group, groupIndex) => (
            <div key={groupIndex}>
              <Text className="font-medium mb-4">{group.title}</Text>
              <ul className="space-y-3">
                {group.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      to={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 flex flex-col md:flex-row justify-between items-center">
          <Text variant="small" className="text-muted-foreground mb-4 md:mb-0">
            © {year} AppName. All rights reserved.
          </Text>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/privacy"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              to="/cookies"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

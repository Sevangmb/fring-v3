
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

  return (
    <footer className={cn("bg-background border-t py-12", className)}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2">
            <Link to="/" className="inline-block mb-4">
              <span className="text-xl font-bold">Fring.app</span>
            </Link>
            <Text variant="small" className="text-muted-foreground max-w-xs">
              Gérez votre garde-robe, créez des tenues stylées et partagez avec vos amis.
            </Text>

            <div className="flex mt-6 space-x-4">
              {socialLinks.map((link, i) => (
                <a 
                  key={i}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-9 w-9 flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent transition-colors"
                  aria-label={link.label}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          {footerLinks.map((group, i) => (
            <div key={i}>
              <Text className="font-medium mb-4">{group.title}</Text>
              <ul className="space-y-3">
                {group.links.map((link, j) => (
                  <li key={j}>
                    <Link 
                      to={link.href} 
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <Text variant="small" className="text-muted-foreground">
            &copy; {year} Fring.app. Tous droits réservés.
          </Text>
          
          <div className="mt-4 md:mt-0">
            <Link to="/admin" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Administration
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

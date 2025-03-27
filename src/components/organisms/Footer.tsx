
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
    <footer className={cn("bg-gray-50 dark:bg-gray-900/50 py-12", className)}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {footerLinks.map((section, i) => (
            <div key={i}>
              <h3 className="font-medium text-sm mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, j) => (
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
        
        <div className="border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <Text className="text-sm text-muted-foreground mb-4 md:mb-0">
            &copy; {year} Fring App. Tous droits réservés.
          </Text>
          
          <div className="flex space-x-4">
            {socialLinks.map((link, i) => (
              <a
                key={i}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

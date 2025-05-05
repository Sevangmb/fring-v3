
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // Initialiser avec le thème stocké ou 'system' par défaut
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('fring-theme');
    return (savedTheme as Theme) || 'system';
  });
  
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  // Fonction pour mettre à jour le thème
  const updateTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('fring-theme', newTheme);
    
    if (newTheme === 'system') {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', systemPrefersDark);
      setResolvedTheme(systemPrefersDark ? 'dark' : 'light');
    } else {
      document.documentElement.classList.toggle('dark', newTheme === 'dark');
      setResolvedTheme(newTheme === 'dark' ? 'dark' : 'light');
    }
  };

  // Écouter les changements de préférences système
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (theme === 'system') {
        document.documentElement.classList.toggle('dark', mediaQuery.matches);
        setResolvedTheme(mediaQuery.matches ? 'dark' : 'light');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    handleChange(); // Appliquer immédiatement
    
    // Nettoyer l'écouteur d'événements
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // Appliquer le thème au chargement initial
  useEffect(() => {
    updateTheme(theme);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme: updateTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextProps => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme doit être utilisé à l\'intérieur du ThemeProvider');
  }
  return context;
};


import React, { createContext, useContext, useEffect, useState } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { useToast } from "@/hooks/use-toast"

interface AuthContextProps {
  session: Session | null
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    console.log("AuthProvider initializing...");
    const setData = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
          console.warn('Erreur lors de la récupération de la session:', error.message)
        } else {
          console.log("Session récupérée:", session ? "Connecté" : "Pas de session");
        }
        setSession(session)
        setUser(session?.user ?? null)
      } catch (error) {
        console.warn('Erreur lors de l\'initialisation de l\'authentification:', error)
      } finally {
        setLoading(false)
      }
    }

    setData()

    try {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log("Auth state changed:", event, session ? "Session présente" : "Pas de session");
          setSession(session)
          setUser(session?.user ?? null)
          setLoading(false)
        }
      )

      return () => {
        subscription.unsubscribe()
      }
    } catch (error) {
      console.warn('Erreur lors de la configuration des événements d\'authentification:', error)
      setLoading(false)
      return () => {}
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      console.log("Tentative de connexion avec email:", email);
      const { error, data } = await supabase.auth.signInWithPassword({ email, password })
      
      if (error) {
        console.error("Erreur de connexion:", error.message);
        toast({
          title: "Erreur de connexion",
          description: error.message,
          variant: "destructive",
        })
        return Promise.reject(error)
      }
      
      console.log("Connexion réussie:", data.user?.id);
      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté",
      })
      
      return Promise.resolve()
    } catch (error) {
      console.error("Exception lors de la connexion:", error)
      toast({
        title: "Erreur de connexion",
        description: "Une erreur est survenue lors de la connexion",
        variant: "destructive",
      })
      return Promise.reject(error)
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    try {
      console.log("Tentative d'inscription avec email:", email);
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: { name }
        }
      })
      
      if (error) {
        console.error("Erreur d'inscription:", error.message);
        toast({
          title: "Erreur d'inscription",
          description: error.message,
          variant: "destructive",
        })
        return Promise.reject(error)
      }
      
      console.log("Inscription réussie pour:", email);
      toast({
        title: "Inscription réussie",
        description: "Veuillez vérifier votre email pour confirmer votre compte",
      })
      
      return Promise.resolve()
    } catch (error) {
      console.error("Exception lors de l'inscription:", error)
      toast({
        title: "Erreur d'inscription",
        description: "Une erreur est survenue lors de l'inscription",
        variant: "destructive",
      })
      return Promise.reject(error)
    }
  }

  const signOut = async () => {
    try {
      console.log("Tentative de déconnexion");
      
      // Nettoyer l'état local avant de tenter la déconnexion côté serveur
      // Cela assure que l'interface reflète immédiatement la déconnexion
      setUser(null)
      setSession(null)
      
      // Tenter la déconnexion côté serveur
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        // Si l'erreur est 'Session not found', ce n'est pas grave puisqu'on veut se déconnecter
        // et nous avons déjà nettoyé l'état local
        if (error.message.includes('Session not found')) {
          console.log("Session déjà expirée, déconnexion locale effectuée");
          toast({
            title: "Déconnexion réussie",
            description: "Vous avez été déconnecté avec succès",
          })
          return Promise.resolve()
        }
        
        // Pour les autres types d'erreurs, on les signale
        console.error("Erreur de déconnexion:", error.message);
        toast({
          title: "Erreur de déconnexion",
          description: error.message,
          variant: "destructive",
        })
        return Promise.reject(error)
      }
      
      console.log("Déconnexion réussie");
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès",
      })
      
      return Promise.resolve()
    } catch (error) {
      console.error("Exception lors de la déconnexion:", error)
      toast({
        title: "Erreur de déconnexion",
        description: "Une erreur est survenue lors de la déconnexion",
        variant: "destructive",
      })
      return Promise.reject(error)
    }
  }

  const value = {
    session,
    user,
    loading,
    signIn,
    signUp,
    signOut
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider')
  }
  return context
}

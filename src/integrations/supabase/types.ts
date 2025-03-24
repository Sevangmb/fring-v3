export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      amis: {
        Row: {
          ami_id: string
          created_at: string
          id: number
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          ami_id: string
          created_at?: string
          id?: number
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          ami_id?: string
          created_at?: string
          id?: number
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: number
          nom: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          nom: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          nom?: string
        }
        Relationships: []
      }
      defi_participations: {
        Row: {
          commentaire: string | null
          created_at: string | null
          defi_id: number
          ensemble_id: number
          id: number
          note: number | null
          user_id: string
        }
        Insert: {
          commentaire?: string | null
          created_at?: string | null
          defi_id: number
          ensemble_id: number
          id?: number
          note?: number | null
          user_id: string
        }
        Update: {
          commentaire?: string | null
          created_at?: string | null
          defi_id?: number
          ensemble_id?: number
          id?: number
          note?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "defi_participations_defi_id_fkey"
            columns: ["defi_id"]
            isOneToOne: false
            referencedRelation: "defis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "defi_participations_ensemble_id_fkey"
            columns: ["ensemble_id"]
            isOneToOne: false
            referencedRelation: "tenues"
            referencedColumns: ["id"]
          },
        ]
      }
      defi_votes: {
        Row: {
          created_at: string
          defi_id: number
          ensemble_id: number
          id: number
          user_id: string
          vote: string
        }
        Insert: {
          created_at?: string
          defi_id: number
          ensemble_id: number
          id?: number
          user_id: string
          vote: string
        }
        Update: {
          created_at?: string
          defi_id?: number
          ensemble_id?: number
          id?: number
          user_id?: string
          vote?: string
        }
        Relationships: [
          {
            foreignKeyName: "defi_votes_defi_id_fkey"
            columns: ["defi_id"]
            isOneToOne: false
            referencedRelation: "defis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "defi_votes_ensemble_id_fkey"
            columns: ["ensemble_id"]
            isOneToOne: false
            referencedRelation: "tenues"
            referencedColumns: ["id"]
          },
        ]
      }
      defis: {
        Row: {
          created_at: string | null
          date_debut: string
          date_fin: string
          description: string
          id: number
          participants_count: number | null
          status: string
          titre: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          date_debut: string
          date_fin: string
          description: string
          id?: number
          participants_count?: number | null
          status?: string
          titre: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          date_debut?: string
          date_fin?: string
          description?: string
          id?: number
          participants_count?: number | null
          status?: string
          titre?: string
          user_id?: string | null
        }
        Relationships: []
      }
      ensemble_votes: {
        Row: {
          created_at: string | null
          ensemble_id: number
          id: number
          user_id: string
          vote: string
        }
        Insert: {
          created_at?: string | null
          ensemble_id: number
          id?: number
          user_id: string
          vote: string
        }
        Update: {
          created_at?: string | null
          ensemble_id?: number
          id?: number
          user_id?: string
          vote?: string
        }
        Relationships: [
          {
            foreignKeyName: "ensemble_votes_ensemble_id_fkey"
            columns: ["ensemble_id"]
            isOneToOne: false
            referencedRelation: "tenues"
            referencedColumns: ["id"]
          },
        ]
      }
      favoris: {
        Row: {
          created_at: string
          element_id: string
          id: string
          type_favori: string
          user_id: string
        }
        Insert: {
          created_at?: string
          element_id: string
          id?: string
          type_favori: string
          user_id: string
        }
        Update: {
          created_at?: string
          element_id?: string
          id?: string
          type_favori?: string
          user_id?: string
        }
        Relationships: []
      }
      marques: {
        Row: {
          created_at: string
          id: number
          logo_url: string | null
          nom: string
          site_web: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          logo_url?: string | null
          nom: string
          site_web?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          logo_url?: string | null
          nom?: string
          site_web?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          read: boolean
          receiver_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          read?: boolean
          receiver_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          read?: boolean
          receiver_id?: string
          sender_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          email: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          email?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          email?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      tenues: {
        Row: {
          created_at: string
          description: string | null
          id: number
          image_url: string | null
          nom: string
          occasion: string | null
          saison: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          image_url?: string | null
          nom: string
          occasion?: string | null
          saison?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          image_url?: string | null
          nom?: string
          occasion?: string | null
          saison?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      tenues_vetements: {
        Row: {
          created_at: string
          id: number
          position_ordre: number | null
          tenue_id: number | null
          vetement_id: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          position_ordre?: number | null
          tenue_id?: number | null
          vetement_id?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          position_ordre?: number | null
          tenue_id?: number | null
          vetement_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tenues_vetements_tenue_id_fkey"
            columns: ["tenue_id"]
            isOneToOne: false
            referencedRelation: "tenues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tenues_vetements_vetement_id_fkey"
            columns: ["vetement_id"]
            isOneToOne: false
            referencedRelation: "vetements"
            referencedColumns: ["id"]
          },
        ]
      }
      vetements: {
        Row: {
          categorie_id: number
          couleur: string
          created_at: string
          description: string | null
          id: number
          image_url: string | null
          marque: string | null
          nom: string
          taille: string
          temperature: string | null
          user_id: string | null
          weather_type: string | null
        }
        Insert: {
          categorie_id: number
          couleur: string
          created_at?: string
          description?: string | null
          id?: number
          image_url?: string | null
          marque?: string | null
          nom: string
          taille: string
          temperature?: string | null
          user_id?: string | null
          weather_type?: string | null
        }
        Update: {
          categorie_id?: number
          couleur?: string
          created_at?: string
          description?: string | null
          id?: number
          image_url?: string | null
          marque?: string | null
          nom?: string
          taille?: string
          temperature?: string | null
          user_id?: string | null
          weather_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_vetements_categories"
            columns: ["categorie_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vetements_categorie_id_fkey"
            columns: ["categorie_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      accepter_ami_simple: {
        Args: {
          ami_id_param: number
        }
        Returns: boolean
      }
      accepter_demande_ami: {
        Args: {
          demande_id: number
          current_user_id: string
        }
        Returns: boolean
      }
      assign_all_clothes_to_user: {
        Args: {
          target_user_id: string
        }
        Returns: boolean
      }
      check_user_has_vetements: {
        Args: {
          user_id_param: string
        }
        Returns: number
      }
      create_table: {
        Args: {
          table_name: string
          columns: string
        }
        Returns: undefined
      }
      exec_sql: {
        Args: {
          query: string
        }
        Returns: undefined
      }
      get_friend_ensembles: {
        Args: {
          friend_id_param: string
        }
        Returns: {
          id: number
          nom: string
          description: string
          occasion: string
          saison: string
          created_at: string
          user_id: string
          vetements: Json[]
          email: string
        }[]
      }
      get_friend_vetements: {
        Args: {
          friend_id_param: string
        }
        Returns: {
          id: number
          nom: string
          categorie_id: number
          couleur: string
          taille: string
          description: string
          marque: string
          image_url: string
          created_at: string
          user_id: string
          owner_email: string
        }[]
      }
      get_friends_clothes: {
        Args: {
          current_user_id_param?: string
        }
        Returns: {
          id: number
          nom: string
          categorie_id: number
          couleur: string
          taille: string
          description: string
          marque: string
          image_url: string
          created_at: string
          user_id: string
          owner_email: string
        }[]
      }
      get_friends_ensembles: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: number
          nom: string
          description: string
          occasion: string
          saison: string
          created_at: string
          user_id: string
          vetements: Json[]
          email: string
        }[]
      }
      get_friends_vetements: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: number
          nom: string
          categorie_id: number
          couleur: string
          taille: string
          description: string
          marque: string
          image_url: string
          created_at: string
          user_id: string
          owner_email: string
        }[]
      }
      get_specific_friend_clothes: {
        Args: {
          friend_id_param: string
        }
        Returns: {
          id: number
          nom: string
          categorie_id: number
          couleur: string
          taille: string
          description: string
          marque: string
          image_url: string
          created_at: string
          user_id: string
          owner_email: string
        }[]
      }
      get_user_id_by_email: {
        Args: {
          email_param: string
        }
        Returns: string
      }
      get_users_by_ids: {
        Args: {
          user_ids: string[]
        }
        Returns: {
          id: string
          email: string
        }[]
      }
      gtrgm_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_decompress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_options: {
        Args: {
          "": unknown
        }
        Returns: undefined
      }
      gtrgm_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      increment: {
        Args: {
          row_id: number
          table_name: string
        }
        Returns: number
      }
      search_users_by_email: {
        Args: {
          search_term: string
        }
        Returns: {
          id: string
          email: string
          created_at: string
        }[]
      }
      set_limit: {
        Args: {
          "": number
        }
        Returns: number
      }
      show_limit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      show_trgm: {
        Args: {
          "": string
        }
        Returns: string[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

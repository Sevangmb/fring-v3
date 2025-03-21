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
      tenues: {
        Row: {
          created_at: string
          description: string | null
          id: number
          image_url: string | null
          nom: string
          occasion: string | null
          saison: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          image_url?: string | null
          nom: string
          occasion?: string | null
          saison?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          image_url?: string | null
          nom?: string
          occasion?: string | null
          saison?: string | null
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
          categorie: string
          couleur: string
          created_at: string
          description: string | null
          id: number
          image_url: string | null
          marque: string | null
          nom: string
          taille: string
          user_id: string | null
        }
        Insert: {
          categorie: string
          couleur: string
          created_at?: string
          description?: string | null
          id?: number
          image_url?: string | null
          marque?: string | null
          nom: string
          taille: string
          user_id?: string | null
        }
        Update: {
          categorie?: string
          couleur?: string
          created_at?: string
          description?: string | null
          id?: number
          image_url?: string | null
          marque?: string | null
          nom?: string
          taille?: string
          user_id?: string | null
        }
        Relationships: []
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
      get_user_id_by_email: {
        Args: {
          email_param: string
        }
        Returns: string
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

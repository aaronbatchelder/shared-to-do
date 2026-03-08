export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Ingredient {
  name: string
  quantity: number | null
  unit: string | null
}

export type Database = {
  public: {
    Tables: {
      households: {
        Row: {
          id: string
          name: string
          invite_code: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          invite_code?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          invite_code?: string | null
          created_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string | null
          phone: string | null
          household_id: string | null
          display_name: string | null
          created_at: string
        }
        Insert: {
          id: string
          email?: string | null
          phone?: string | null
          household_id?: string | null
          display_name?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          phone?: string | null
          household_id?: string | null
          display_name?: string | null
          created_at?: string
        }
      }
      weeks: {
        Row: {
          id: string
          household_id: string
          start_date: string
          created_at: string
        }
        Insert: {
          id?: string
          household_id: string
          start_date: string
          created_at?: string
        }
        Update: {
          id?: string
          household_id?: string
          start_date?: string
          created_at?: string
        }
      }
      recipes: {
        Row: {
          id: string
          household_id: string
          title: string
          source_url: string | null
          source_image_url: string | null
          ingredients: Ingredient[]
          instructions: string | null
          created_at: string
        }
        Insert: {
          id?: string
          household_id: string
          title: string
          source_url?: string | null
          source_image_url?: string | null
          ingredients?: Ingredient[]
          instructions?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          household_id?: string
          title?: string
          source_url?: string | null
          source_image_url?: string | null
          ingredients?: Ingredient[]
          instructions?: string | null
          created_at?: string
        }
      }
      week_recipes: {
        Row: {
          week_id: string
          recipe_id: string
          created_at: string
        }
        Insert: {
          week_id: string
          recipe_id: string
          created_at?: string
        }
        Update: {
          week_id?: string
          recipe_id?: string
          created_at?: string
        }
      }
      grocery_items: {
        Row: {
          id: string
          week_id: string
          name: string
          quantity: number | null
          unit: string | null
          store: string | null
          recipe_id: string | null
          checked: boolean
          checked_by_user_id: string | null
          checked_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          week_id: string
          name: string
          quantity?: number | null
          unit?: string | null
          store?: string | null
          recipe_id?: string | null
          checked?: boolean
          checked_by_user_id?: string | null
          checked_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          week_id?: string
          name?: string
          quantity?: number | null
          unit?: string | null
          store?: string | null
          recipe_id?: string | null
          checked?: boolean
          checked_by_user_id?: string | null
          checked_at?: string | null
          created_at?: string
        }
      }
      errands: {
        Row: {
          id: string
          week_id: string
          title: string
          store: string | null
          checked: boolean
          checked_by_user_id: string | null
          checked_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          week_id: string
          title: string
          store?: string | null
          checked?: boolean
          checked_by_user_id?: string | null
          checked_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          week_id?: string
          title?: string
          store?: string | null
          checked?: boolean
          checked_by_user_id?: string | null
          checked_at?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Convenience types
export type Household = Database['public']['Tables']['households']['Row']
export type User = Database['public']['Tables']['users']['Row']
export type Week = Database['public']['Tables']['weeks']['Row']
export type Recipe = Database['public']['Tables']['recipes']['Row']
export type WeekRecipe = Database['public']['Tables']['week_recipes']['Row']
export type GroceryItem = Database['public']['Tables']['grocery_items']['Row']
export type Errand = Database['public']['Tables']['errands']['Row']

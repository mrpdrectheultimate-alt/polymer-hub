export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          subscription_status: 'free' | 'premium'
          queries_used: number
          queries_reset_at: string
          created_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          subscription_status?: 'free' | 'premium'
          queries_used?: number
          queries_reset_at?: string
          created_at?: string
        }
        Update: {
          email?: string | null
          full_name?: string | null
          subscription_status?: 'free' | 'premium'
          queries_used?: number
          queries_reset_at?: string
        }
      }
      subjects: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          icon: string | null
          color: string | null
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          icon?: string | null
          color?: string | null
          order_index?: number
          created_at?: string
        }
        Update: {
          name?: string
          slug?: string
          description?: string | null
          icon?: string | null
          color?: string | null
          order_index?: number
        }
      }
      lessons: {
        Row: {
          id: string
          subject_id: string
          title: string
          slug: string
          content: string
          summary: string | null
          is_premium: boolean
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          subject_id: string
          title: string
          slug: string
          content: string
          summary?: string | null
          is_premium?: boolean
          order_index?: number
          created_at?: string
        }
        Update: {
          title?: string
          slug?: string
          content?: string
          summary?: string | null
          is_premium?: boolean
          order_index?: number
        }
      }
      lesson_embeddings: {
        Row: {
          id: string
          lesson_id: string
          chunk_text: string
          embedding: number[] | null
          chunk_index: number
          created_at: string
        }
        Insert: {
          id?: string
          lesson_id: string
          chunk_text: string
          embedding?: number[] | null
          chunk_index?: number
          created_at?: string
        }
        Update: {
          chunk_text?: string
          embedding?: number[] | null
          chunk_index?: number
        }
      }
      materials: {
        Row: {
          id: string
          name: string
          family: string
          density: number | null
          melt_temp: string | null
          tensile_strength: string | null
          top_applications: string[] | null
          indian_trade_names: string[] | null
          is_premium: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          family: string
          density?: number | null
          melt_temp?: string | null
          tensile_strength?: string | null
          top_applications?: string[] | null
          indian_trade_names?: string[] | null
          is_premium?: boolean
          created_at?: string
        }
        Update: {
          name?: string
          family?: string
          density?: number | null
          melt_temp?: string | null
          tensile_strength?: string | null
          top_applications?: string[] | null
          indian_trade_names?: string[] | null
          is_premium?: boolean
        }
      }
      videos: {
        Row: {
          id: string
          title: string
          youtube_url: string
          subject_id: string | null
          is_premium: boolean
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          youtube_url: string
          subject_id?: string | null
          is_premium?: boolean
          created_at?: string
        }
        Update: {
          title?: string
          youtube_url?: string
          subject_id?: string | null
          is_premium?: boolean
        }
      }
      payment_requests: {
        Row: {
          id: string
          user_id: string
          screenshot_url: string | null
          status: 'pending' | 'approved' | 'rejected'
          amount: number
          created_at: string
          reviewed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          screenshot_url?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          amount?: number
          created_at?: string
          reviewed_at?: string | null
        }
        Update: {
          screenshot_url?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          reviewed_at?: string | null
        }
      }
    }
    Functions: {
      match_lesson_chunks: {
        Args: {
          query_embedding: number[]
          match_threshold?: number
          match_count?: number
        }
        Returns: {
          id: string
          lesson_id: string
          chunk_text: string
          similarity: number
        }[]
      }
      reset_daily_queries: {
        Args: { user_id: string }
        Returns: void
      }
    }
  }
}

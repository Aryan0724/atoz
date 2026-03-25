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
          full_name: string | null
          phone: string | null
          company_name: string | null
          gst_number: string | null
          created_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          phone?: string | null
          company_name?: string | null
          gst_number?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          phone?: string | null
          company_name?: string | null
          gst_number?: string | null
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          category: string | null
          quality_levels: string[] | null
          customization_fields: string[] | null
          moq: number
          base_price: number | null
          delivery_days: string | null
          packaging_options: string[] | null
          images: string[] | null
          template_images: string[] | null
          supported_views: string[] | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          category?: string | null
          quality_levels?: string[] | null
          customization_fields?: string[] | null
          moq?: number
          base_price?: number | null
          delivery_days?: string | null
          packaging_options?: string[] | null
          images?: string[] | null
          template_images?: string[] | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          category?: string | null
          quality_levels?: string[] | null
          customization_fields?: string[] | null
          moq?: number
          base_price?: number | null
          delivery_days?: string | null
          packaging_options?: string[] | null
          images?: string[] | null
          template_images?: string[] | null
          is_active?: boolean
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string | null
          product_id: string | null
          quantity: number
          quality_level: string | null
          design_data: Json | null
          design_preview_url: string | null
          customization_details: Json | null
          total_price: number | null
          status: string | null
          payment_status: string | null
          razorpay_order_id: string | null
          shipping_address: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          product_id?: string | null
          quantity: number
          quality_level?: string | null
          design_data?: Json | null
          design_preview_url?: string | null
          customization_details?: Json | null
          total_price?: number | null
          status?: string | null
          payment_status?: string | null
          razorpay_order_id?: string | null
          shipping_address?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          product_id?: string | null
          quantity?: number
          quality_level?: string | null
          design_data?: Json | null
          design_preview_url?: string | null
          customization_details?: Json | null
          total_price?: number | null
          status?: string | null
          payment_status?: string | null
          razorpay_order_id?: string | null
          shipping_address?: Json | null
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
  }
}

export type Product = Database['public']['Tables']['products']['Row']
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Order = Database['public']['Tables']['orders']['Row']

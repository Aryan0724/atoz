export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  base_price: number;
  moq: number;
  delivery_days: string | number;
  images: string[];
  quality_levels?: string[];
  customization_fields?: string[];
  packaging_options?: string[];
  template_images?: string[];
  wireframe_images?: string[];
  color_variants?: { name: string; hex: string; wireframe_images: string[] }[];
  supported_views?: string[];
  features?: string[];
  specifications?: any;
  stock_quantity?: number;
  is_active?: boolean;
  quality_prices?: Record<string, number>;
  bulk_discount_rules?: { quantity: number; discount: number }[];
  design_areas?: Record<string, { x: number; y: number; w: number; h: number }>;
  created_at?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface CheckoutAttempt {
  id: string;
  user_id?: string;
  product_id?: string;
  quantity?: number;
  quality_level?: string;
  total_price?: number;
  status: 'pending' | 'successful';
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  total_price: number;
  status: 'pending' | 'confirmed' | 'in_production' | 'dispatched' | 'out_for_delivery' | 'delivered' | 'cancelled';
  payment_status?: 'unpaid' | 'paid' | 'failed' | 'refunded' | 'pending_cod' | 'cod_collected' | 'cod_remitted';
  payment_method?: 'Online' | 'COD';
  tracking_number?: string;
  courier_name?: string;
  estimated_delivery?: string;
  tracking_url?: string;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  shipping_address: any;
  // Verification fields
  delivery_confirmed_by_customer?: boolean;
  delivery_confirmed_at?: string;
  delivery_disputed?: boolean;
  delivery_dispute_note?: string;
  cod_collection_status?: 'not_applicable' | 'pending' | 'collected' | 'failed';
  cod_collected_at?: string;
  cod_remitted_at?: string;
  admin_notes?: string;
  created_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  quality_level: string;
  design_data: any;
  created_at?: string;
  product?: Product;
}

export interface Profile {
  id: string;
  full_name?: string;
  email?: string;
  phone?: string;
  avatar_url?: string;
  company_name?: string;
  gst_number?: string;
  role: 'customer' | 'admin';
  addresses?: any[];
  payment_methods?: any[];
  wishlist?: string[];
  created_at?: string;
}

export interface CmsContent {
  id: string;
  slug: string;
  title: string;
  type: 'Page' | 'Blog' | 'Campaign';
  status: 'draft' | 'published';
  content?: string;
  author_id?: string;
  author_name?: string;
  last_modified?: string;
  created_at?: string;
  featured_image?: string;
  excerpt?: string;
  meta_description?: string;
  tags?: string[];
  reading_time?: number;
}

export interface Database {
  public: {
    Tables: {
      products: {
        Row: Product;
        Insert: Omit<Product, 'id' | 'created_at'>;
        Update: Partial<Product>;
      };
      profiles: {
        Row: Profile;
        Insert: Profile;
        Update: Partial<Profile>;
      };
      orders: {
        Row: Order;
        Insert: Omit<Order, 'id' | 'created_at'>;
        Update: Partial<Order>;
      };
      order_items: {
        Row: OrderItem;
        Insert: Omit<OrderItem, 'id' | 'created_at'>;
        Update: Partial<OrderItem>;
      };
      cms_content: {
        Row: CmsContent;
        Insert: Omit<CmsContent, 'id' | 'created_at' | 'last_modified'>;
        Update: Partial<CmsContent>;
      };
    };
  };
}

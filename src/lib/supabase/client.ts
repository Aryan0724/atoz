import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_anon_key_for_build'

export const supabase = createBrowserClient(
  supabaseUrl,
  supabaseAnonKey
)

export function createClient() {
  return supabase
}

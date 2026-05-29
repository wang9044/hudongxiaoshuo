import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Novel = {
  id: number
  title: string
  author: string
  description: string
  cover_url: string | null
  created_at: string
}

export type Scene = {
  id: number
  novel_id: number
  order_index: number
  title: string
  text: string
}

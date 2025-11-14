import { createClient } from '@supabase/supabase-js'

// Get keys from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://yfehfkmeruawtuwduyvt.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlmZWhma21lcnVhd3R1d2R1eXZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMzkxMTUsImV4cCI6MjA3ODcxNTExNX0.XKJGee3n30KF8Cts-Jdpr34N38ztInpF3qwRdXbqeyY'

// Check for keys
if (!supabaseUrl || supabaseUrl.includes('YOUR_SUPABASE_URL')) {
  console.warn('⚠️ Supabase URL is not configured! Check your .env file')
}

if (!supabaseAnonKey || supabaseAnonKey.includes('YOUR_SUPABASE_ANON_KEY')) {
  console.warn('⚠️ Supabase Anon Key is not configured! Check your .env file')
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface DatabaseUser {
  id: string
  username: string
  avatar: string
  password_hash?: string | null
  total_score: number
  games_played: number
  best_score: number
  created_at: string
}

export interface DatabaseLeaderboardEntry {
  id: string
  user_id: string
  username: string
  avatar: string
  score: number
  date: string
}


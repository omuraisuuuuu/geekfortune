import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qxkmwmrjsyjxmtydahct.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4a213bXJqc3lqeG10eWRhaGN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxNDMyNzgsImV4cCI6MjA3ODcxOTI3OH0.xQi4JbxBDk8u2ZtSkcrRTsbVUOtbrpsgGPRICy_2ybo'

if (!supabaseUrl || supabaseUrl.includes('YOUR_SUPABASE_URL')) {
  console.warn('⚠️ Supabase URL is not configured! Check your .env file')
}

if (!supabaseAnonKey || supabaseAnonKey.includes('YOUR_SUPABASE_ANON_KEY')) {
  console.warn('⚠️ Supabase Anon Key is not configured! Check your .env file')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
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


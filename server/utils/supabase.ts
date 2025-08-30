// server/utils/supabase.ts
import { createClient } from '@supabase/supabase-js'

export const serverSupabase = () => {
  const cfg = useRuntimeConfig()
  // Use private service role on the server (bypasses RLS)
  return createClient(cfg.public.supabaseUrl, cfg.supabaseServiceRole, {
    auth: { persistSession: false },
  })
}

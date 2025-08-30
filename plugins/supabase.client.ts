// plugins/supabase.client.ts
import { createClient } from '@supabase/supabase-js'

export default defineNuxtPlugin(() => {
  const cfg = useRuntimeConfig().public
  const { $supabase } = useNuxtApp()
  const supa = createClient(cfg.supabaseUrl, cfg.supabaseAnonKey, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
  })
  return { provide: { supabase: supa } }
})

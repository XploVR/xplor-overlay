// server/utils/supabase.ts
import { createClient } from '@supabase/supabase-js'

/**
 * Server-only Supabase client factory.
 * Uses Service Role key (NEVER expose to client code).
 */
export function serverSupabase() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error(
      'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment. ' +
      'Set them in .env (server environment only).'
    )
  }

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { headers: { 'X-Client-Info': 'xplor-overlay/nitro' } },
  })
}

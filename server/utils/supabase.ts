// server/utils/supabase.ts
import { createClient } from '@supabase/supabase-js'

export function serverSupabase() {
  const { public: pub } = useRuntimeConfig()
  const key = process.env.SUPABASE_SERVICE_ROLE || pub.supabaseAnonKey
  if (!pub.supabaseUrl || !key) {
    throw createError({ statusCode: 500, statusMessage: 'Supabase URL/key missing' })
  }
  return createClient(pub.supabaseUrl, key)
}

// types/supabase-server.d.ts
declare module '#supabase/server' {
  export const serverSupabaseClient: <T = any>(event?: any) => T
  export const serverSupabaseServiceRole: <T = any>(event?: any) => T
  export const serverSupabaseUser: (event?: any) => Promise<any>
}

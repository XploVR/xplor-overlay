export default defineEventHandler((event) => {
  const cfg = useRuntimeConfig()
  return {
    supabaseUrl: cfg.public.supabaseUrl,
    anonKey: cfg.public.supabaseAnonKey ? '✅ loaded' : '❌ missing'
  }
})

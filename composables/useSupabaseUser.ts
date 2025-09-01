// /composables/useSupabaseUser.ts
export const useSupabaseUser = () => {
  const config = useRuntimeConfig()
  // In no-auth dev, pretend we’re unauthenticated (or return a fake user if you prefer)
  return config.public.requireAuth ? ref(null) : ref({ id: 'dev-user', email: 'dev@local' })
}

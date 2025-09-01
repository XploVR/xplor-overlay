export default defineNuxtRouteMiddleware(() => {
  const config = useRuntimeConfig()
  if (!config.public.requireAuth) return
  // later: enforce real auth here
})

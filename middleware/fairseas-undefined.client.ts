export default defineNuxtRouteMiddleware((to) => {
  if (to.path === '/fairseas/undefined') {
    console.warn('[fairseas] redirected from /fairseas/undefined')
    return navigateTo('/fairseas')
  }
})

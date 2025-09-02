// middleware/recentlyViewed.global.ts
export default defineNuxtRouteMiddleware((to) => {
  if (process.server) return
  try {
    // Only record space detail pages: /spaces/:id
    if (to.name && String(to.name).startsWith('spaces-') && typeof to.params?.id === 'string') {
      const id = to.params.id as string
      const key = 'xplor_recent'
      const now = new Date().toISOString()

      const raw = localStorage.getItem(key)
      const list: { id: string; at: string }[] = raw ? JSON.parse(raw) : []
      const dedup = list.filter(x => x.id !== id)
      dedup.unshift({ id, at: now })
      localStorage.setItem(key, JSON.stringify(dedup.slice(0, 20)))
    }
  } catch {}
})

// server/api/properties.get.ts
export default defineEventHandler(async () => {
  const storage = useStorage('data')
  const keys = await storage.getKeys('listings').catch(() => [])
  const stored = await Promise.all(keys.map(k => storage.getItem<any>(k)))

  const mappedStored = stored.map((x) => ({
    id: x.id,
    title: x.details?.title,
    city: x.details?.city,
    price: x.details?.price,
    status: x.details?.status || 'draft',
    created_at: x.createdAt,
    // coords: add when you capture them in details
  }))

  // keep or remove your seed data; combining here
  const seed = [
    { id: 1, title: 'Demo Villa', city: 'Palma',     status: 'published', price: 123456, created_at: '2025-08-01T10:00:00Z' },
    { id: 2, title: 'Seafront Loft', city: 'Felanitx', status: 'draft',     price: 789000, created_at: '2025-08-20T09:00:00Z' },
    // …
  ]

  return [...mappedStored, ...seed]
})
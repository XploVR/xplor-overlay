// server/api/listings/index.get.ts
import { defineEventHandler } from 'h3'

type Privacy = 'public' | 'private' | 'pin'
export type ListingRow = {
  id: string
  title: string
  city?: string
  country?: string
  views30d: number
  hits30d: number
  trend: number
  spark: number[]
  privacy: Privacy
  pinCode?: string | null
  updatedAt: string
}

const seed = (): ListingRow[] => {
  const now = new Date().toISOString()
  return [
    {
      id: 're_101', title: 'Hillside Finca', city: 'Marbella', country: 'ES',
      views30d: 1240, hits30d: 182, trend: +12,
      spark: Array.from({ length: 30 }, (_, i) => 40 + Math.round(30 * Math.sin(i / 3)) + (i % 3) * 5),
      privacy: 'public', pinCode: null, updatedAt: now
    },
    {
      id: 're_102', title: 'Port Palace Penthouse', city: 'Monaco', country: 'MC',
      views30d: 932, hits30d: 133, trend: -4,
      spark: Array.from({ length: 30 }, (_, i) => 50 + Math.round(25 * Math.cos(i / 4)) + (i % 5)),
      privacy: 'pin', pinCode: '754219', updatedAt: now
    },
    {
      id: 're_103', title: 'City Loft 5B', city: 'London', country: 'UK',
      views30d: 680, hits30d: 96, trend: +6,
      spark: Array.from({ length: 30 }, (_, i) => 35 + Math.round(35 * Math.sin(i / 5 + 1))),
      privacy: 'private', pinCode: null, updatedAt: now
    }
  ]
}

export default defineEventHandler(async () => {
  const storage = useStorage('data')
  let rows = (await storage.getItem<ListingRow[]>('listings.json')) || null
  if (!rows || !Array.isArray(rows) || rows.length === 0) {
    rows = seed()
    await storage.setItem('listings.json', rows)
  }
  return rows
})

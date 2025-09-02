// server/api/listings/[id].get.ts
import { defineEventHandler, createError } from 'h3'
import type { ListingRow } from './index.get'

export default defineEventHandler(async (event) => {
  const { id } = event.context.params as { id: string }
  const storage = useStorage('data')
  const rows = (await storage.getItem<ListingRow[]>('listings.json')) || []
  const row = rows.find(r => r.id === id)
  if (!row) throw createError({ statusCode: 404, statusMessage: 'Not found' })
  return row
})

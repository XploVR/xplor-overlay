// server/api/listings/[id]/privacy.post.ts
import { defineEventHandler, readBody, createError } from 'h3'
import type { ListingRow } from '../../index.get'

type Body = { privacy: 'public' | 'private' | 'pin'; pinCode?: string | null }

export default defineEventHandler(async (event) => {
  const { id } = event.context.params as { id: string }
  const body = await readBody<Body>(event)
  if (!body?.privacy) throw createError({ statusCode: 400, statusMessage: 'privacy required' })
  if (body.privacy === 'pin' && !body.pinCode) {
    throw createError({ statusCode: 400, statusMessage: 'pinCode required for PIN privacy' })
  }

  const storage = useStorage('data')
  const rows = (await storage.getItem<ListingRow[]>('listings.json')) || []
  const idx = rows.findIndex(r => r.id === id)
  if (idx === -1) throw createError({ statusCode: 404, statusMessage: 'Listing not found' })

  rows[idx].privacy = body.privacy
  rows[idx].pinCode = body.privacy === 'pin' ? (body.pinCode || '') : null
  rows[idx].updatedAt = new Date().toISOString()

  await storage.setItem('listings.json', rows)
  return { ok: true }
})

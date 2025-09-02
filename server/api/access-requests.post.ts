// server/api/access-requests.post.ts
import { defineEventHandler, readBody, createError } from 'h3'
import type { AccessRequest } from './access-requests/index.get'

const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36)
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default defineEventHandler(async (event) => {
  const body = await readBody<Partial<AccessRequest> & { listingId: string; email: string }>(event)
  if (!body?.listingId) throw createError({ statusCode: 400, statusMessage: 'listingId required' })
  if (!body?.email || !emailRe.test(body.email)) throw createError({ statusCode: 400, statusMessage: 'valid email required' })

  const row: AccessRequest = {
    id: uid(),
    listingId: body.listingId,
    email: body.email,
    note: body.note || '',
    status: 'pending',
    createdAt: new Date().toISOString(),
  }

  const storage = useStorage('data')
  const rows = (await storage.getItem<AccessRequest[]>('access-requests.json')) || []
  rows.unshift(row)
  await storage.setItem('access-requests.json', rows)

  return { ok: true, id: row.id }
})

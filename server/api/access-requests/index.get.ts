// server/api/access-requests/index.get.ts
import { defineEventHandler } from 'h3'

export type AccessRequest = {
  id: string
  listingId: string
  email: string
  note?: string
  status: 'pending'|'approved'|'rejected'
  createdAt: string
}

export default defineEventHandler(async () => {
  const storage = useStorage('data')
  const rows = (await storage.getItem<AccessRequest[]>('access-requests.json')) || []
  return rows
})

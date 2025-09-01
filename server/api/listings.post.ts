// server/api/listings.post.ts
import { z } from 'zod'

const PayloadSchema = z.object({
  details: z.object({
    title: z.string().min(1),
    city: z.string().optional(),
    price: z.number().optional(),
    status: z.enum(['draft','published']).optional(),
    energyRating: z.string().optional(),
    showingInstructions: z.string().optional(),
    leadContactPreference: z.enum(['email','phone','form','none']).optional(),
    description: z.string().optional(),
  }),
  media: z.object({
    primaryPhotos: z.array(z.object({
      name: z.string(),
      url: z.string().url().optional(),
      order: z.number().optional(),
      primary: z.boolean().optional(),
    })).min(1),
    virtualTours: z.array(z.object({ url: z.string().url() })).default([]),
    videos: z.array(z.object({ url: z.string().url() })).default([]),
    drone: z.array(z.object({ name: z.string(), url: z.string().url().optional(), order: z.number().optional() })).default([]),
    floorPlans: z.array(z.object({ name: z.string(), url: z.string().url().optional(), order: z.number().optional() })).default([]),
    documents: z.array(z.object({ name: z.string(), url: z.string().url().optional(), order: z.number().optional() })).default([]),
    additional: z.array(z.object({ name: z.string(), url: z.string().url().optional(), order: z.number().optional() })).default([]),
  }),
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event).catch(() => null)
  if (!body) throw createError({ statusCode: 400, statusMessage: 'No body' })

  const parsed = PayloadSchema.safeParse(body)
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message || 'Invalid payload'
    throw createError({ statusCode: 422, statusMessage: msg })
  }

  const id = `lst_${Date.now()}`
  const storage = useStorage('data')
  const record = { id, ...parsed.data, createdAt: new Date().toISOString() }
  await storage.setItem(`listings/${id}.json`, record)

  return { ok: true, id }
})

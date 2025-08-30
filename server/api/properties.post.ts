// server/api/properties.post.ts
import { serverSupabase } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const supabase = serverSupabase()
  const body = await readBody<{
    kind?: 'real_estate' | 'yacht' | 'gallery' | string
    title: string
    description: string
    address_line1: string
    city: string
    country: string
    lat?: number | null
    lng?: number | null
  }>(event)

  // Basic validation to avoid DB NOT NULL errors
  const required = ['title', 'description', 'address_line1', 'city', 'country'] as const
  for (const k of required) {
    if (!(body as any)?.[k] || String((body as any)[k]).trim() === '') {
      throw createError({ statusCode: 400, statusMessage: `Missing field: ${k}` })
    }
  }

  const payload = {
    kind: body.kind || 'real_estate',
    title: body.title,
    description: body.description,
    address_line1: body.address_line1,
    city: body.city,
    country: body.country,
    lat: body.lat ?? null,
    lng: body.lng ?? null,
    status: 'draft' as const,
  }

  const { data, error } = await supabase
    .from('properties')
    .insert(payload)
    .select('*')
    .single()

  if (error) {
    console.error('[properties.post]', error)
    throw createError({ statusCode: 500, statusMessage: error.message })
  }
  return data
})

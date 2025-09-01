// server/api/properties.post.ts
import { serverSupabase } from '~~/server/utils/supabase'
import type { H3Event } from 'h3'

type Body = {
  kind?: 'real_estate' | 'yacht' | 'gallery' | 'development' | string
  title: string
  description: string
  address_line1: string
  city: string
  country: string
  lat?: number | null
  lng?: number | null
}

const REQUIRED_KEYS: Array<keyof Body> = [
  'title',
  'description',
  'address_line1',
  'city',
  'country',
]

export default defineEventHandler(async (event: H3Event) => {
  // Guard method (this file is .post.ts, but explicit checks help during refactors)
  if (getMethod(event).toUpperCase() !== 'POST') {
    throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' })
  }

  // Parse JSON
  const body = await readBody<Body>(event)
  if (!body || typeof body !== 'object') {
    throw createError({ statusCode: 400, statusMessage: 'Invalid JSON body' })
  }

  // Basic validation
  for (const k of REQUIRED_KEYS) {
    const v = (body as any)[k]
    if (v == null || String(v).trim() === '') {
      throw createError({ statusCode: 400, statusMessage: `Missing field: ${k}` })
    }
  }

  // Normalize payload
  const payload = {
    kind: body.kind ?? 'real_estate',
    title: body.title.trim(),
    description: body.description.trim(),
    address_line1: body.address_line1.trim(),
    city: body.city.trim(),
    country: body.country.trim(),
    lat: body.lat ?? null,
    lng: body.lng ?? null,
    status: 'draft' as const,
  }

  // Insert
  try {
    const supabase = serverSupabase()
    const { data, error } = await supabase
      .from('properties')
      .insert(payload)
      .select('*')
      .single()

    if (error) {
      // Forward a clean 500 to client; keep details in server logs
      console.error('[properties.post] insert error:', error)
      throw createError({ statusCode: 500, statusMessage: 'Failed to create property' })
    }

    setResponseStatus(event, 201)
    return data
  } catch (err: any) {
    if (err?.statusCode) throw err
    console.error('[properties.post] unexpected error:', err)
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error' })
  }
})

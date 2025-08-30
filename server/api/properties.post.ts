// server/api/properties.post.ts
import { serverSupabase } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const devOwner = process.env.DEV_OWNER_UUID // optional dev owner to make “My Listings” work

  const payload = {
    kind: body.kind ?? 'real_estate',
    title: String(body.title || '').trim(),
    description: body.description ?? '',
    address_line1: body.address_line1 ?? '',
    city: body.city ?? '',
    country: body.country ?? '',
    lat: Number(body.lat ?? 0),
    lng: Number(body.lng ?? 0),
    status: body.status ?? 'draft',
    ...(devOwner ? { owner_user_id: devOwner } : {}) // dev-only convenience
  }
  if (!payload.title) throw createError({ statusCode: 400, statusMessage: 'Title required' })

  const supabase = serverSupabase()
  const { data, error } = await supabase.from('properties').insert(payload).select('*').single()
  if (error) {
    console.error('[properties.post]', error)
    throw createError({ statusCode: 500, statusMessage: error.message })
  }
  return data
})

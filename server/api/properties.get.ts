// server/api/properties.get.ts
import { serverSupabase } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const supabase = serverSupabase()
  const q = getQuery(event) as { status?: string; kind?: string; city?: string }

  // Prefer view with thumbnail_url
  let query = supabase
    .from('properties_with_thumb')
    .select('id,kind,title,description,city,country,status,created_at,lat,lng,thumbnail_url')
    .order('created_at', { ascending: false })
    .limit(200)

  if (q.status) query = query.eq('status', q.status)
  if (q.kind)   query = query.eq('kind', q.kind)
  if (q.city)   query = query.ilike('city', `%${q.city}%`)

  const { data, error } = await query

  if (error) {
    // Fallback: embed media and compute first URL
    const fb = await supabase
      .from('properties')
      .select(`
        id, kind, title, description, city, country, status, created_at, lat, lng,
        property_media ( url, position, created_at )
      `)
      .order('created_at', { ascending: false })
      .limit(200)

    if (fb.error) {
      throw createError({ statusCode: 500, statusMessage: fb.error.message })
    }

    return (fb.data || []).map((p: any) => {
      const media = Array.isArray(p.property_media) ? p.property_media : []
      const first = media.find((m: any) => m.position === 0) || media[0] || null
      return {
        id: p.id, kind: p.kind, title: p.title, description: p.description,
        city: p.city, country: p.country, status: p.status, created_at: p.created_at,
        lat: p.lat, lng: p.lng, thumbnail_url: first?.url || null,
      }
    })
  }

  return data ?? []
})

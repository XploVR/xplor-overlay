// server/api/property-media.post.ts
import { serverSupabase } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const supabase = serverSupabase()
  const body = await readBody<{
    property_id: string
    items: { kind?: 'image'; url: string; position?: number }[]
  }>(event)

  if (!body?.property_id || !Array.isArray(body.items)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid body' })
  }
  if (!body.items.length) {
    throw createError({ statusCode: 400, statusMessage: 'No media items' })
  }

  const rows = body.items.map((it, i) => ({
    property_id: body.property_id,
    kind: it.kind || 'image',
    url: it.url,
    position: typeof it.position === 'number' ? it.position : i,
  }))

  const { error } = await supabase.from('property_media').insert(rows)
  if (error) {
    console.error('[property-media.post]', error)
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  return { ok: true, count: rows.length }
})

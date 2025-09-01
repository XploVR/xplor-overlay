// server/api/property-media/index.post.ts
import { serverSupabaseClient } from '#supabase'

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    property_id: string,
    items: { kind: 'image'|'video'|'doc'|'tour', url: string, position?: number }[]
  }>(event)

  if (!body?.property_id || !Array.isArray(body.items) || body.items.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'property_id and items[] required' })
  }

  const client = await serverSupabaseClient(event)

  const rows = body.items.map((it, i) => ({
    property_id: body.property_id,
    kind: it.kind || 'image',
    url: it.url,
    position: typeof it.position === 'number' ? it.position : i
  }))

  const { error } = await client.from('media').insert(rows)
  if (error) throw createError({ statusCode: 500, statusMessage: error.message })

  return { ok: true, inserted: rows.length }
})


// server/api/property-media.post.ts
import { serverSupabase } from '~/server/utils/supabase'

type Body = {
  property_id: string,
  items: { kind:'image'|'floorplan'|'video'|'tour', url:string, position?:number }[]
}

export default defineEventHandler(async (event) => {
  const body = await readBody<Body>(event)
  if (!body?.property_id || !Array.isArray(body.items)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid body' })
  }

  const supabase = serverSupabase()
  const rows = body.items.map(i => ({ ...i, property_id: body.property_id }))

  const { data, error } = await supabase.from('property_media').insert(rows).select('*')
  if (error) {
    console.error('[property-media.post] insert error:', error)
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  // If property has no cover_url yet, set it to the first uploaded image's URL
  const firstImage = rows
    .filter(r => r.kind === 'image')
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))[0]

  if (firstImage?.url) {
    const { data: prop, error: getErr } = await supabase
      .from('properties')
      .select('id, cover_url')
      .eq('id', body.property_id)
      .single()

    if (!getErr && (!prop?.cover_url || prop.cover_url === '')) {
      const { error: upErr } = await supabase
        .from('properties')
        .update({ cover_url: firstImage.url })
        .eq('id', body.property_id)

      if (upErr) console.error('[property-media.post] cover_url update error:', upErr.message)
    }
  }

  return data
})

// server/api/property-media/reorder.post.ts
import { serverSupabase } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const supabase = serverSupabase()
  const body = await readBody<{ property_id: string; order: string[] }>(event)
  // order: array of media IDs in desired order (0 = cover)
  if (!body?.property_id || !Array.isArray(body.order)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid body' })
  }

  // Batch updates
  const updates = body.order.map((id, idx) => ({ id, position: idx }))
  const { error } = await supabase.from('property_media').upsert(updates, { onConflict: 'id' })
  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  return { ok: true }
})

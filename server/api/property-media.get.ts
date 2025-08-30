// server/api/property-media.get.ts
import { serverSupabase } from '~/server/utils/supabase'
export default defineEventHandler(async (event) => {
  const q = getQuery(event) as { property_id?: string }
  const supabase = serverSupabase()
  let query = supabase.from('property_media').select('*').order('position', { ascending: true })
  if (q.property_id) query = query.eq('property_id', q.property_id)
  const { data, error } = await query
  if (error) { console.error('[property-media.get]', error.message); return [] }
  return data ?? []
})

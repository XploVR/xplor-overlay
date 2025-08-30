// server/api/supa-storage.get.ts
import { serverSupabase } from '~/server/utils/supabase'

export default defineEventHandler(async () => {
  try {
    const supabase = serverSupabase()
    // Try to list the root of the public bucket
    const { data, error } = await supabase.storage.from('property-media').list('', { limit: 10 })
    if (error) return { ok: false, where: 'storage', error: error.message }

    // If you uploaded "oni.png", also build its public URL
    const pub = supabase.storage.from('property-media').getPublicUrl('oni.png')
    return { ok: true, where: 'storage', listed: data?.map(f => f.name), oniUrl: pub.data.publicUrl }
  } catch (e: any) {
    return { ok: false, where: 'server', error: e.message }
  }
})

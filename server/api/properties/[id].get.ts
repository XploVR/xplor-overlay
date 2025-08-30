// server/api/properties/[id].get.ts
import { serverSupabase } from '~/server/utils/supabase'
export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event)
  const supabase = serverSupabase()
  const { data, error } = await supabase.from('properties').select('*').eq('id', id).single()
  if (error) throw createError({ statusCode: 404, statusMessage: error.message })
  return data
})

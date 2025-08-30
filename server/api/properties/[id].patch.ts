// server/api/properties/[id].patch.ts
import { serverSupabase } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const supabase = serverSupabase()
  const id = getRouterParam(event, 'id')!
  const body = await readBody<Partial<{
    title: string
    description: string
    address_line1: string
    city: string
    country: string
    lat: number | null
    lng: number | null
    status: 'draft' | 'active' | 'archived'
  }>>(event)

  const { data, error } = await supabase
    .from('properties')
    .update(body)
    .eq('id', id)
    .select('*')
    .single()

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  return data
})

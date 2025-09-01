import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const user = await serverSupabaseUser(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing media id' })
  }
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  // Lookup media row
  const { data: row, error: rErr } = await client
    .from('media')
    .select('*')
    .eq('id', id)
    .single()

  if (rErr || !row) {
    throw createError({ statusCode: 404, statusMessage: 'Media not found' })
  }

  // Delete from storage if url is in the public bucket
  if (row.url && row.url.includes('/storage/v1/object/public/property-media/')) {
    const path = row.url.split('/property-media/')[1]
    if (path) {
      await client.storage.from('property-media').remove([path])
    }
  }

  // Delete the DB row
  const { error: dErr } = await client
    .from('media')
    .delete()
    .eq('id', id)

  if (dErr) {
    throw createError({ statusCode: 500, statusMessage: dErr.message })
  }

  return { success: true }
})

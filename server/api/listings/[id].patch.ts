// server/api/listings/[id].patch.ts
export default defineEventHandler(async (event) => {
const id = getRouterParam(event, 'id')
const body = await readBody(event)
// update listing
return { ok: true, id, updatedAt: new Date().toISOString() }
})
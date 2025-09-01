// server/api/media/upload.post.ts
export default defineEventHandler(async (event) => {
const body = await readBody<{ name: string; type: string }>(event)
// In real life, create a presigned URL; here we return a mock public URL
return { ok: true, url: `/uploads/mock/${Date.now()}_${body.name}` }
})
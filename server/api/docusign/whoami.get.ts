export default defineEventHandler(async () => {
  const token = await useStorage('data').getItem<any>('docusign:token')
  if (!token?.access_token) {
    throw createError({ statusCode: 401, statusMessage: 'No stored token. Hit /api/docusign/login first.' })
  }
  const info = await $fetch('https://account-d.docusign.com/oauth/userinfo', {
    headers: { Authorization: `Bearer ${token.access_token}` }
  })
  return info
})

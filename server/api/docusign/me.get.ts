// server/api/docusign/me.get.ts
import * as docusign from 'docusign-esign'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'docusign_access_token')
  if (!token) throw createError({ statusCode: 401, message: 'No DocuSign token' })

  const apiClient = new docusign.ApiClient()
  try {
    const info = await apiClient.getUserInfo(token)
    return { name: info?.name, userName: info?.userName, accounts: info?.accounts }
  } catch (e: any) {
    console.error('[docusign/me] getUserInfo failed:', e?.response?.text || e)
    throw createError({ statusCode: 401, message: 'Invalid/expired DocuSign token' })
  }
})

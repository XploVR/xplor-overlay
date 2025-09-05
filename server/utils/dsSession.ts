import { $fetch } from 'ofetch'

export async function getDsSession(event: any) {
  const raw = getCookie(event, 'ds')
  if (!raw) throw createError({ statusCode: 401, statusMessage: 'No DocuSign session' })
  const ds = JSON.parse(raw)

  if (Date.now() < ds.expires_at) return ds

  // Refresh if we have a refresh_token
  if (!ds.refresh_token) throw createError({ statusCode: 401, statusMessage: 'Token expired; reconnect DocuSign' })

  const res = await $fetch(`${process.env.DS_AUTH_BASE_URL}/oauth/token`, {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + Buffer.from(`${process.env.DS_INTEGRATION_KEY}:${process.env.DS_CLIENT_SECRET}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: ds.refresh_token
    }).toString()
  })

  ds.access_token = res.access_token
  ds.expires_at   = Date.now() + (res.expires_in - 60) * 1000
  ds.refresh_token = res.refresh_token ?? ds.refresh_token // may rotate
  setCookie(event, 'ds', JSON.stringify(ds), { httpOnly: true, secure: true, sameSite: 'lax', path: '/' })
  return ds
}

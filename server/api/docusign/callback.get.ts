// server/api/docusign/callback.get.ts
import { defineEventHandler, getQuery, getCookie, setCookie } from 'h3'

export default defineEventHandler(async (event) => {
  const cfg = useRuntimeConfig()
  const ds = cfg.docusign

  const { code, state, error, error_description } = getQuery(event) as Record<string, string | undefined>
  if (error) {
    throw createError({ statusCode: 400, message: `DocuSign returned error: ${error}: ${error_description || ''}` })
  }
  if (!code) throw createError({ statusCode: 400, message: 'Missing ?code from DocuSign' })

  // Validate state
  const expectedState = getCookie(event, 'ds_pkce_state') || ''
  if (!state || state !== expectedState) {
    throw createError({ statusCode: 400, message: 'State mismatch' })
  }

  // PKCE verifier
  const verifier = getCookie(event, 'ds_pkce_verifier') || ''
  if (!verifier) {
    throw createError({ statusCode: 400, message: 'Missing PKCE verifier (cookie expired?)' })
  }

  // Exchange code → tokens
  const tokenUrl = new URL('/oauth/token', ds.authBaseUrl).toString()
  const form = new URLSearchParams()
  form.set('grant_type', 'authorization_code')
  form.set('code', code)
  form.set('redirect_uri', ds.redirectUri)
  form.set('client_id', ds.integrationKey)
  form.set('code_verifier', verifier)
  // If your integration key has a client secret, include it (confidential client)
  if (ds.clientSecret) form.set('client_secret', ds.clientSecret)

  let tokenRes: any
  try {
    tokenRes = await $fetch(tokenUrl, {
      method: 'POST',
      body: form.toString(),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
  } catch (e: any) {
    const msg = e?.data || e?.message || e
    console.error('[docusign/callback] token exchange failed:', msg)
    throw createError({ statusCode: 400, message: 'DocuSign token exchange failed.' })
  }

  const { access_token, expires_in, token_type } = tokenRes || {}
  if (!access_token) {
    throw createError({ statusCode: 400, message: 'DocuSign token missing from response.' })
  }

  // Get user info (base_uri + default account)
  let userInfo: any
  try {
    userInfo = await $fetch(new URL('/oauth/userinfo', ds.authBaseUrl).toString(), {
      headers: { Authorization: `Bearer ${access_token}` }
    })
  } catch (e: any) {
    console.warn('[docusign/callback] userinfo fetch failed:', e?.data || e?.message || e)
  }

  // Persist the essentials in httpOnly cookies for later API calls
  const cookieOpts = {
    httpOnly: true as const,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: Math.max(60, (expires_in || 3600) - 60) // a little earlier than expiry
  }
  setCookie(event, 'docusign_access_token', access_token, cookieOpts)
  if (userInfo?.accounts?.length) {
    const defaultAcct = userInfo.accounts.find((a: any) => a.is_default) || userInfo.accounts[0]
    if (defaultAcct?.account_id) setCookie(event, 'docusign_account_id', defaultAcct.account_id, cookieOpts)
    if (defaultAcct?.base_uri) setCookie(event, 'docusign_base_uri', `${defaultAcct.base_uri}/restapi`, cookieOpts)
  }

  // Clear the one-time PKCE cookies
  setCookie(event, 'ds_pkce_verifier', '', { path: '/', maxAge: 0 })
  setCookie(event, 'ds_pkce_state', '', { path: '/', maxAge: 0 })

  // Send the user back into your app (crew page works well)
  const backTo = `${cfg.public.appBaseUrl.replace(/\/$/, '')}/fairseas/crew?connected=1`
  return sendRedirect(event, backTo, 302)
})

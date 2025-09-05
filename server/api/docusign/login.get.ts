// server/api/docusign/login.get.ts
import { defineEventHandler, setCookie } from 'h3'
import { randomBytes, createHash } from 'node:crypto'

function b64url(buf: Buffer) {
  return buf.toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '')
}

export default defineEventHandler(async (event) => {
  const cfg = useRuntimeConfig()
  const ds = cfg.docusign

  if (!ds.integrationKey || !ds.redirectUri || !ds.authBaseUrl) {
    throw createError({
      statusCode: 500,
      message: 'DocuSign config missing (integrationKey/redirectUri/authBaseUrl).'
    })
  }

  // --- PKCE: create verifier + challenge ---
  const verifier = b64url(randomBytes(64))
  const challenge = b64url(createHash('sha256').update(verifier).digest())

  // CSRF state
  const state = b64url(randomBytes(16))

  // Store verifier + state in httpOnly cookies for the callback to read
  const cookieOpts = {
    httpOnly: true as const,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 10 * 60 // 10 minutes
  }
  setCookie(event, 'ds_pkce_verifier', verifier, cookieOpts)
  setCookie(event, 'ds_pkce_state', state, cookieOpts)

  // Build DocuSign OAuth URL (Authorization Code + PKCE)
  const url = new URL('/oauth/auth', ds.authBaseUrl)
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('scope', 'signature')
  url.searchParams.set('client_id', ds.integrationKey)
  url.searchParams.set('redirect_uri', ds.redirectUri)
  url.searchParams.set('state', state)
  url.searchParams.set('code_challenge', challenge)
  url.searchParams.set('code_challenge_method', 'S256')

  return sendRedirect(event, url.toString(), 302)
})

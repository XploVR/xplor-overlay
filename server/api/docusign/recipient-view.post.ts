// server/api/docusign/recipient-view.post.ts
import axios from 'axios'

export default defineEventHandler(async (event) => {
  const cfg = useRuntimeConfig()
  const token =
    (event.context as any).docusignToken ||
    getCookie(event, 'docusign_access_token')

  if (!token) {
    throw createError({ statusCode: 401, message: 'No DocuSign token; hit /api/docusign/login first.' })
  }

  const raw = (await readBody<any>(event).catch(() => ({}))) || {}
  const envelopeId = String(raw.envelopeId || '').trim()
  const name       = String(raw.name || raw.userName || '').trim()
  const email      = String(raw.email || '').trim()
  const crewId     = String(raw.clientUserId || raw.crewId || '').trim()
  const recipientId = String(raw.recipientId || '1')

  if (!envelopeId || !name || !email || !crewId) {
    throw createError({ statusCode: 400, message: 'Missing envelopeId, name, email, or crewId' })
  }

  // Resolve account + basePath from userinfo
  let accountId = cfg.docusign.accountId || ''
  let basePath  = cfg.docusign.basePath || 'https://demo.docusign.net/restapi'
  try {
    const authBase = cfg.docusign.authBaseUrl || 'https://account-d.docusign.com'
    const ui = await axios.get(`${authBase}/oauth/userinfo`, {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 15000
    })
    const acct =
      ui.data?.accounts?.find((a: any) => a.is_default) ||
      ui.data?.accounts?.[0]
    if (acct) {
      accountId = accountId || acct.account_id
      basePath  = `${acct.base_uri}/restapi`
    }
  } catch (e: any) {
    console.warn('[recipient-view] userinfo lookup failed:', e?.response?.data || e?.message)
  }
  if (!accountId) {
    throw createError({ statusCode: 400, message: 'DocuSign accountId not resolved.' })
  }

  // Ensure envelope is sent/delivered
  const statusResp = await axios.get(
    `${basePath}/v2.1/accounts/${accountId}/envelopes/${envelopeId}`,
    { headers: { Authorization: `Bearer ${token}` }, timeout: 10000 }
  )
  const status = String(statusResp.data?.status || '').toLowerCase()
  if (status !== 'sent' && status !== 'delivered') {
    throw createError({ statusCode: 400, message: `Envelope status is "${status}". Must be "sent" or "delivered" to create recipient view.` })
  }

  const returnBase =
    cfg.public?.embedReturnUrl ||
    `${cfg.public?.appBaseUrl || 'http://localhost:3000'}/fairseas/thanks`

  const body = {
    returnUrl: `${returnBase}?envelopeId=${encodeURIComponent(envelopeId)}`,
    authenticationMethod: 'none',
    email,
    userName: name,
    clientUserId: crewId,
    recipientId,
    pingFrequency: '600',
    pingUrl: cfg.public?.appBaseUrl || 'http://localhost:3000'
  }

  if (process.dev) {
    console.log('[recipient-view] accountId:', accountId)
    console.log('[recipient-view] basePath:', basePath)
    console.log('[recipient-view] envelopeId:', envelopeId)
    console.log('[recipient-view] posting to:',
      `${basePath}/v2.1/accounts/${accountId}/envelopes/${envelopeId}/views/recipient`)
    console.log('[recipient-view] body:', JSON.stringify(body))
  }

  try {
    const { data } = await axios.post(
      `${basePath}/v2.1/accounts/${accountId}/envelopes/${envelopeId}/views/recipient`,
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-DocuSign-SDK': 'Nuxt-DirectAxios'
        },
        timeout: 30000
      }
    )

    if (process.dev) console.log('[recipient-view] DocuSign returned URL:', data?.url)

    if (!data?.url) {
      throw createError({ statusCode: 500, message: 'DocuSign did not return a signing URL.' })
    }
    return { url: data.url }
  } catch (e: any) {
    const ds = e?.response?.data
    console.error('[recipient-view] DocuSign error:', ds || e?.message || e)
    throw createError({
      statusCode: e?.response?.status || 500,
      message: ds?.message || ds?.errorDescription || e?.message || 'DocuSign createRecipientView failed.'
    })
  }
})

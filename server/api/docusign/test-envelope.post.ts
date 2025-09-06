// server/api/docusign/test-envelope.post.ts (Create this as a test)
import * as docusign from 'docusign-esign'
import { getCookie, readBody, setCookie } from 'h3'

export default defineEventHandler(async (event) => {
  const cfg = useRuntimeConfig()
  const ds  = cfg.docusign

  const accessToken = getCookie(event, 'docusign_access_token')
  if (!accessToken) {
    throw createError({
      statusCode: 401,
      message: 'Not connected to DocuSign. Click "Connect DocuSign" first.'
    })
  }

  let accountId = getCookie(event, 'docusign_account_id') || ds.accountId || ''
  let basePath  = getCookie(event, 'docusign_base_uri') || ds.basePath || 'https://demo.docusign.net/restapi'

  const apiClient = new docusign.ApiClient()
  apiClient.setBasePath(basePath)
  apiClient.addDefaultHeader('Authorization', `Bearer ${accessToken}`)

  // Read inputs
  const raw = (await readBody<any>(event).catch(() => ({}))) || {}
  const name   = String(raw.name ?? '').trim()
  const email  = String(raw.email ?? '').trim()
  let crewId   = String(raw.crewId ?? '').trim()

  if (!name || !email) {
    throw createError({ statusCode: 400, message: 'Missing required fields: name, email.' })
  }
  if (!crewId) crewId = `guest_${Math.random().toString(36).slice(2)}_${Date.now()}`

  // Resolve account if needed
  if (!accountId || !getCookie(event, 'docusign_base_uri')) {
    try {
      const authBase = ds.authBaseUrl || 'https://account-d.docusign.com'
      const ui: any = await $fetch(new URL('/oauth/userinfo', authBase).toString(), {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      const def = ui?.accounts?.find((a: any) => a.is_default) || ui?.accounts?.[0]
      accountId = accountId || def?.account_id
      const rest = `${def?.base_uri || ''}/restapi`
      if (!accountId || !rest) throw new Error('No account_id/base_uri in userinfo')
      basePath = rest
      setCookie(event, 'docusign_account_id', accountId, { httpOnly: true, sameSite: 'lax', path: '/' })
      setCookie(event, 'docusign_base_uri',  basePath,  { httpOnly: true, sameSite: 'lax', path: '/' })
      apiClient.setBasePath(basePath)
    } catch {
      throw createError({
        statusCode: 401,
        message: 'DocuSign session present but no account found. Please reconnect.'
      })
    }
  }

  console.log('[test-envelope] Using account:', accountId)
  console.log('[test-envelope] Base path:', basePath)

  // Load PDF
  let pdfBuffer: Buffer
  try {
    const absolute = new URL('/fairseas/FSA.pdf', cfg.public.appBaseUrl).toString()
    const arr = await $fetch<ArrayBuffer>(absolute, { responseType: 'arrayBuffer' })
    pdfBuffer = Buffer.from(arr)
  } catch {
    const { readFile } = await import('node:fs/promises')
    const { fileURLToPath } = await import('node:url')
    const fsUrl = new URL('../../../public/fairseas/FSA.pdf', import.meta.url)
    pdfBuffer = await readFile(fileURLToPath(fsUrl))
  }

  console.log('[test-envelope] PDF loaded, size:', pdfBuffer.length, 'bytes')

  // Create Document with explicit property setting
  const document = new docusign.Document()
  document.documentBase64 = pdfBuffer.toString('base64')
  document.name = 'FairSeas FSA'
  document.fileExtension = 'pdf'
  document.documentId = '1'

  console.log('[test-envelope] Document created:', {
    name: document.name,
    documentId: document.documentId,
    fileExtension: document.fileExtension,
    hasBase64: !!document.documentBase64
  })

  // Create MINIMAL tabs - just one sign here with absolute positioning
  const signHere = new docusign.SignHere()
  signHere.documentId = '1'
  signHere.pageNumber = '1'
  signHere.recipientId = '1'
  signHere.xPosition = '100'
  signHere.yPosition = '200'

  const tabs = new docusign.Tabs()
  tabs.signHereTabs = [signHere]

  // Create signer with explicit property setting
  const signer = new docusign.Signer()
  signer.email = email
  signer.name = name
  signer.recipientId = '1'
  signer.clientUserId = crewId
  signer.routingOrder = '1'
  signer.tabs = tabs

  console.log('[test-envelope] Signer created:', {
    email: signer.email,
    name: signer.name,
    recipientId: signer.recipientId,
    clientUserId: signer.clientUserId,
    routingOrder: signer.routingOrder,
    hasSignTab: !!(signer.tabs && signer.tabs.signHereTabs && signer.tabs.signHereTabs.length > 0)
  })

  // Create recipients
  const recipients = new docusign.Recipients()
  recipients.signers = [signer]

  // Create envelope definition with explicit property setting
  const envelopeDefinition = new docusign.EnvelopeDefinition()
  envelopeDefinition.emailSubject = 'FairSeas — Test FSA'
  envelopeDefinition.documents = [document]
  envelopeDefinition.recipients = recipients
  envelopeDefinition.status = 'sent' // Try sending directly

  console.log('[test-envelope] Envelope definition created, sending...')

  const envelopesApi = new docusign.EnvelopesApi(apiClient)

  try {
    const createResult = await envelopesApi.createEnvelope(accountId, { 
      envelopeDefinition 
    })

    const envelopeId = createResult.envelopeId
    console.log('[test-envelope] Envelope created with ID:', envelopeId)

    // Check status immediately
    const envelopeInfo = await envelopesApi.getEnvelope(accountId, envelopeId)
    console.log('[test-envelope] Immediate status:', envelopeInfo.status)

    return {
      envelopeId,
      name,
      email,
      crewId,
      status: envelopeInfo.status,
      basePath
    }

  } catch (error: any) {
    console.error('[test-envelope] Error:', error?.response?.body || error?.response?.text || error.message)
    
    let errorMessage = 'Failed to create test envelope'
    let errorDetails = error?.response?.body || error?.response?.text || error.message

    try {
      if (typeof errorDetails === 'string' && errorDetails.startsWith('{')) {
        const parsed = JSON.parse(errorDetails)
        errorMessage = parsed.message || parsed.errorDescription || errorMessage
        errorDetails = parsed
      }
    } catch {
      // Keep original error
    }

    throw createError({
      statusCode: error?.response?.status || 500,
      message: errorMessage,
      data: { details: errorDetails }
    })
  }
})